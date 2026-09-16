const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

test('Hobby deployment exposes no more than 12 API functions',()=>{
  const files=[];
  function walk(dir){
    for(const name of fs.readdirSync(dir)){
      const p=path.join(dir,name); const st=fs.statSync(p);
      if(st.isDirectory()) walk(p);
      else if(name.endsWith('.js') && !name.startsWith('_')) files.push(path.relative(root,p));
    }
  }
  walk(path.join(root,'api'));
  assert.ok(files.length<=12,`found ${files.length} deployable API functions: ${files.join(', ')}`);
});
