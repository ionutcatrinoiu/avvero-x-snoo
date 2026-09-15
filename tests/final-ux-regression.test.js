const fs=require('fs'); const s=fs.readFileSync(process.argv[2]||'index.html','utf8');
function ok(c,m){if(!c)throw new Error(m)}
const pick=(s.match(/function pick\(v,b\)\{[\s\S]*?\}\nlet registrationSubmitted/)||[])[0]||'';
ok(pick.includes('S[key]=v'),'pick must store selection');
ok(!pick.includes('setTimeout'),'pick must not auto advance');
ok(!pick.includes('n++'),'pick must not advance step');
ok(pick.includes("querySelectorAll('.answer.sel')"),'pick must clear sibling selection');
ok(/\.nav-success-stack\s*\{[^}]*display\s*:\s*flex/i.test(s),'success actions need flex stack');
ok(/flex-direction\s*:\s*column!important/.test(s),'mobile success actions must be vertical');
ok((s.match(/nav\.innerHTML=`<div class="nav-success-stack">/g)||[]).length>=2,'all success renderers must use stack container');
console.log('final UX regression tests OK');
