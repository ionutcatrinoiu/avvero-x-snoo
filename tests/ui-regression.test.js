const fs=require('fs');
const root=fs.readFileSync('index.html','utf8');
const admin=fs.readFileSync('admin/index.html','utf8');
let fail=0; const t=(n,c)=>{console.log((c?'PASS':'FAIL')+' '+n);if(!c)fail++};
t('mobile hint is inline, not fixed', !/\.swipe-hint\{[^}]*position:fixed/i.test(root) && /\.swipe-hint\{[^}]*margin-top:/i.test(root));
t('login has principal Avvero logo', admin.includes('/avvero-logo-principal.png') && admin.includes('admin-login-logo'));
t('dashboard has secondary Avvero logo', admin.includes('/avvero-logo-secundar.png') && admin.includes('admin-dashboard-logo'));
process.exit(fail?1:0);
