const fs=require('fs'); const s=fs.readFileSync('index.html','utf8');
const checks=[
 ['tracks gesture during touchmove',/addEventListener\('touchmove'/],
 ['hint text has no arrow span',/Glisează în sus<\/div>/],
 ['hint anchored at page bottom',/\.swipe-hint\{[^}]*position:fixed[^}]*bottom:/s],
 ['swipe transition avoids blur filter',/\.step\.swipe-drag\{[^}]*filter:none/s]
];
let fail=0; for(const [n,r] of checks){const ok=r.test(s); console.log(ok?'PASS':'FAIL',n); if(!ok)fail++;} process.exit(fail?1:0);
