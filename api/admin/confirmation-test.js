const {readSession,noStore}=require('./_auth');
const {getFirestore}=require('./_firebase');
const {sendConfirmation,sendRegistrationConfirmation}=require('../_reminder');
const {EVENT}=require('../_event');
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim());
module.exports=async(req,res)=>{
  noStore(res);
  if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  if(!readSession(req))return res.status(401).json({error:'UNAUTHORIZED'});
  const body=req.body||{},action=String(body.action||'test');
  try{
    if(action==='recover-one'){
      const id=String(body.registrationId||'').trim();
      if(!id)return res.status(400).json({error:'INVALID_REGISTRATION'});
      const ref=getFirestore().collection('snoo_registrations').doc(id),snap=await ref.get();
      if(!snap.exists)return res.status(404).json({error:'REGISTRATION_NOT_FOUND'});
      const r=snap.data();
      if(!r.email)return res.status(400).json({error:'NO_EMAIL'});
      if(r.confirmationEmailSent===true)return res.status(200).json({ok:true,skipped:true});
      const result=await sendRegistrationConfirmation(ref);
      return res.status(200).json({ok:true,...result});
    }
    if(action==='recover-all'){
      const snap=await getFirestore().collection('snoo_registrations').get();
      const pending=snap.docs.filter(d=>{const r=d.data();return !!r.email&&r.confirmationEmailSent!==true});
      const batch=pending.slice(0,3);let sent=0,errors=0;
      for(const doc of batch){try{const result=await sendRegistrationConfirmation(doc.ref);if(result.sent)sent++}catch(e){errors++;console.error('confirmation recovery failed',doc.id,e.message)}}
      return res.status(200).json({ok:true,attempted:batch.length,sent,errors,remaining:Math.max(0,pending.length-batch.length)});
    }
    const email=String(body.email||'').trim();
    if(!emailOk(email))return res.status(400).json({error:'INVALID_EMAIL'});
    const data=await sendConfirmation({firstName:'Test',participationCode:'SNOO-TEST',event:EVENT},email,`snoo-confirmation-test/${Date.now()}`);
    return res.status(200).json({ok:true,emailId:data&&data.messageId||null});
  }catch(e){console.error('confirmation action failed',e);return res.status(500).json({error:'CONFIRMATION_ACTION_FAILED',message:String(e.message||e).slice(0,200)})}
};
