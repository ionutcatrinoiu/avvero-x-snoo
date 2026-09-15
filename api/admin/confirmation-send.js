const {readSession,noStore}=require('./_auth');
const {getFirestore}=require('./_firebase');
const {sendRegistrationConfirmation}=require('../_reminder');
module.exports=async(req,res)=>{
  noStore(res);
  if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  if(!readSession(req))return res.status(401).json({error:'UNAUTHORIZED'});
  const registrationId=String((req.body||{}).registrationId||'').trim();
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
  }catch(e){console.error('confirmation send failed',e.message);return res.status(500).json({error:'CONFIRMATION_SEND_FAILED'})}
};
