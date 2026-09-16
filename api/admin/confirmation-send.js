const {readSession,noStore}=require('./_auth');
const {getFirestore}=require('./_firebase');
const {sendRegistrationConfirmation}=require('../_reminder');
const BATCH_LIMIT=50;

module.exports=async(req,res)=>{
  noStore(res);
  if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  if(!readSession(req))return res.status(401).json({error:'UNAUTHORIZED'});

  const body=req.body||{};
  if(body.bulk===true){
    try{
      const snap=await getFirestore().collection('snoo_registrations').get();
      const pending=snap.docs.filter(doc=>{const x=doc.data();return Boolean(String(x.email||'').trim())&&!x.confirmationEmailSent});
      const candidates=pending.sort((a,b)=>Boolean(a.data().confirmationEmailError)-Boolean(b.data().confirmationEmailError)).slice(0,BATCH_LIMIT);
      let sent=0,errors=0;
      for(const doc of candidates){
        try{const result=await sendRegistrationConfirmation(doc.ref);if(result&&result.sent)sent++}
        catch(e){errors++;console.error('confirmation recovery item failed',doc.id,e.message)}
      }
      return res.status(200).json({attempted:candidates.length,sent,errors,remaining:Math.max(0,pending.length-sent)});
    }catch(e){
      console.error('confirmation recovery failed',e.message);
      return res.status(500).json({error:'CONFIRMATION_RECOVERY_FAILED'});
    }
  }

  const registrationId=String(body.registrationId||'').trim();
  if(!registrationId)return res.status(400).json({error:'REGISTRATION_REQUIRED'});
  try{
    const ref=getFirestore().collection('snoo_registrations').doc(registrationId);
    const snap=await ref.get();
    if(!snap.exists)return res.status(404).json({error:'REGISTRATION_NOT_FOUND'});
    const r=snap.data();
    if(!r.email)return res.status(400).json({error:'EMAIL_MISSING'});
    if(r.confirmationEmailSent===true)return res.status(200).json({sent:false,alreadySent:true});
    const result=await sendRegistrationConfirmation(ref);
    return res.status(200).json(result);
  }catch(e){
    console.error('confirmation send failed',e.message);
    return res.status(500).json({error:'CONFIRMATION_SEND_FAILED'});
  }
};
