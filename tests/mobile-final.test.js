const fs=require('fs');
const s=fs.readFileSync('index.html','utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(s.includes("window.matchMedia('(max-width:760px)').matches?'':"),'mobile must not render continue control');
ok(s.includes("document.body.classList.toggle('keyboard-open'"),'keyboard state missing');
ok(s.includes('.keyboard-open .swipe-hint{display:none!important}'),'hint must hide above keyboard');
ok(s.includes('raw.githubusercontent.com/romania/localitati/master/json/orase.min.json'),'full locality source missing');
ok(s.includes("r.judetAuto||r.countyCode||r.county||''"),'county code parser must prefer judetAuto');
console.log('mobile final tests OK');
