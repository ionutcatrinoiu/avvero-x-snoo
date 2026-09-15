const fs=require('fs'); const s=fs.readFileSync('index.html','utf8');
if(!s.includes("if(e.target.closest('.go'))return;")) throw new Error('hero swipe must ignore registration button touches');
if(!s.includes("function start(){flow.style.transition='';flow.style.opacity='';flow.style.clipPath='';")) throw new Error('start must clear swipe preview inline styles');
console.log('button start regression OK');
