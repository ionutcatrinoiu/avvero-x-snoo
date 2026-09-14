const crypto=require('crypto');
const username=process.argv[2]||'admin';
const password=crypto.randomBytes(12).toString('base64url');
const salt=crypto.randomBytes(16).toString('hex');
crypto.scrypt(password,salt,32,(err,key)=>{if(err)throw err;console.log('\nSNOO 2026 ADMIN - valori pentru Vercel Production\n');console.log('SNOO_ADMIN_USERNAME='+username);console.log('SNOO_ADMIN_PASSWORD_HASH='+salt+':'+key.toString('hex'));console.log('SNOO_ADMIN_SESSION_SECRET='+crypto.randomBytes(48).toString('base64url'));console.log('\nPAROLA ADMIN (păstreaz-o separat, nu o pune în Vercel ca plaintext): '+password+'\n')});
