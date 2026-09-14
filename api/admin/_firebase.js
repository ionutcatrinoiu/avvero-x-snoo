const admin=require('firebase-admin');
function getFirestore(){if(!admin.apps.length){const raw=process.env.SNOO_FIREBASE_ADMIN_CONFIG;if(!raw)throw new Error('SNOO_FIREBASE_ADMIN_CONFIG is not configured');admin.initializeApp({credential:admin.credential.cert(JSON.parse(raw))})}return admin.firestore()}
module.exports={admin,getFirestore};
