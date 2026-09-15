const admin=require('firebase-admin');
function db(){
 if(!admin.apps.length){
  const raw=process.env.SNOO_FIREBASE_ADMIN_CONFIG;
  if(!raw)throw new Error('SNOO_FIREBASE_ADMIN_CONFIG is not configured');
  admin.initializeApp({credential:admin.credential.cert(JSON.parse(raw))});
 }
 return admin.firestore();
}
function normalizePhone(v=''){
 let x=String(v).replace(/\D/g,'');
 if(x.startsWith('0040'))x='0'+x.slice(4);else if(x.startsWith('40'))x='0'+x.slice(2);
 if(!/^07\d{8}$/.test(x))throw new Error('INVALID_PHONE');
 return x;
}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 try{
  const phone=normalizePhone((req.body||{}).phone);
  const snap=await db().collection('snoo_phone_keys').doc(phone).get();
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({exists:snap.exists});
 }catch(e){
  if(e.message==='INVALID_PHONE')return res.status(400).json({error:'INVALID_PHONE'});
  console.error(e);return res.status(500).json({error:'CHECK_FAILED'});
 }
};
