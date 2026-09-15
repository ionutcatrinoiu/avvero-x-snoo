const fs=require('fs');
const s=fs.readFileSync(process.argv[2]||'index.html','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(s.includes('function gdprSwipeHomeEnabled()'), 'GDPR home swipe gate missing');
ok(s.includes('function resetGdprHomeDrag('), 'GDPR drag reset missing');
ok(s.includes('function commitGdprHome('), 'GDPR home commit missing');
ok(s.includes("flow.classList.remove('open','liquid-open')"), 'flow must close back to landing');
ok(s.includes('translate3d(0,${dy}px,0)'), 'GDPR flow must track finger 1:1');
ok(s.includes("flow.classList.add('liquid-open')"), 'Liquid Glass class missing during return');
console.log('gdpr swipe home test OK');
