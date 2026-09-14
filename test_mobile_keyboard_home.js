const fs=require('fs'); const s=fs.readFileSync('index.html','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(s.includes('enterkeyhint="next"'),'inputs must request Next on mobile keyboard');
ok(s.includes("e.key==='Enter'"),'Enter must advance');
ok(s.includes('mobileFieldBlurAdvance'),'mobile keyboard Done/check blur must advance');
ok(!s.includes('.inline-next,.modal>.nav{display:none!important}'),'mobile nav must not be globally hidden');
ok(s.includes('mobile-success-home'),'success home button missing');
console.log('mobile keyboard/home tests OK');
