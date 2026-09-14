const admin=require('firebase-admin');

function db(){
 if(!admin.apps.length){
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if(!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
  admin.initializeApp({credential:admin.credential.cert(JSON.parse(raw))});
 }
 return admin.firestore();
}
function normalizePhone(v=''){
 let x=String(v).replace(/[^\d+]/g,'');
 if(x.startsWith('0040'))x='0'+x.slice(4);
 else if(x.startsWith('+40'))x='0'+x.slice(3);
 if(!/^07\d{8}$/.test(x))throw new Error('INVALID_PHONE');
 return x;
}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 try{
  const b=req.body||{};
  const required=['firstName','lastName','phone','opticalStore','role','city','streetAddress','usesMyopiaManagement','knowsMyoless'];
  if(!b.gdprConsent||required.some(k=>!String(b[k]??'').trim()))return res.status(400).json({error:'MISSING_FIELDS'});
  const phone=normalizePhone(b.phone);
  const store=db();
  const phoneRef=store.collection('snoo_phone_keys').doc(phone);
  const counterRef=store.collection('snoo_meta').doc('registration_counter');
  const regRef=store.collection('snoo_registrations').doc();
  let participationCode='';
  await store.runTransaction(async tx=>{
   const [phoneSnap,counterSnap]=await Promise.all([tx.get(phoneRef),tx.get(counterRef)]);
   if(phoneSnap.exists)throw new Error('DUPLICATE_PHONE');
   const seq=(counterSnap.exists?Number(counterSnap.data().value)||0:0)+1;
   participationCode='SNOO-'+String(seq).padStart(4,'0');
   const now=admin.firestore.FieldValue.serverTimestamp();
   tx.set(counterRef,{value:seq},{merge:true});
   tx.set(phoneRef,{registrationId:regRef.id,createdAt:now});
   tx.set(regRef,{
    participationCode,firstName:String(b.firstName).trim(),lastName:String(b.lastName).trim(),
    phoneNormalized:phone,email:b.email?String(b.email).trim().toLowerCase():null,
    opticalStore:String(b.opticalStore).trim(),role:String(b.role).trim(),
    city:String(b.city).trim(),county:String(b.county||'').trim(),
    streetAddress:String(b.streetAddress).trim(),
    usesMyopiaManagement:String(b.usesMyopiaManagement),knowsMyoless:String(b.knowsMyoless),
    gdprConsent:true,gdprConsentAt:now,event:'SNOO 2026',giftDelivered:false,registeredAt:now
   });
  });
  return res.status(201).json({ok:true,participationCode});
 }catch(e){
  if(e.message==='DUPLICATE_PHONE')return res.status(409).json({error:'DUPLICATE_PHONE'});
  if(e.message==='INVALID_PHONE')return res.status(400).json({error:'INVALID_PHONE'});
  console.error(e);return res.status(500).json({error:'SAVE_FAILED'});
 }
}
