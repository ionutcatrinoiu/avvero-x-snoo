const fs=require('fs'); const s=fs.readFileSync(process.argv[2]||'index.html','utf8');
function ok(x,m){if(!x)throw new Error(m)}
ok(s.includes('id="final-regression-fix"'),'final override missing');
ok(s.includes('capture:true'),'capture swipe missing');
ok(s.includes('livePhoneGate'),'live phone gate missing');
ok(s.includes('AUTO_FIELD_DELAY=700'),'unified auto advance missing');
ok(s.includes('final-success-actions'),'final success action renderer missing');
ok(s.includes('@media(max-width:760px){.final-success-actions .desktop-only'),'mobile exact actions CSS missing');
ok(s.includes('@media(min-width:761px){.final-success-actions .mobile-only'),'desktop exact actions CSS missing');
console.log('final regression tests OK');
