const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const checks=[
 ['mobile swipe hint',/Glisează în sus/],
 ['touch start listener',/touchstart/],
 ['touch end listener',/touchend/],
 ['swipe calls next',/next\(\)/],
 ['swipe calls back',/back\(\)/],
 ['mobile hides inline next',/@media\(max-width:760px\)[\s\S]*?\.inline-next[\s\S]*?display\s*:\s*none/]
];
let fail=0;for(const [name,re] of checks){if(!re.test(html)){console.error('FAIL',name);fail++}else console.log('PASS',name)}process.exit(fail?1:0);
