const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('admin reuses protected confirmation endpoint for individual and bulk recovery',()=>{
  const endpoint=read('api/admin/confirmation-test.js');
  assert.match(endpoint,/readSession/);
  assert.match(endpoint,/sendRegistrationConfirmation/);
  assert.match(endpoint,/action===['"]send['"]/);
  assert.match(endpoint,/action===['"]recover['"]/);
  assert.match(endpoint,/confirmationEmailSent/);
});

test('admin dashboard exposes pending count, bulk recovery, and individual send action',()=>{
  const html=read('admin/index.html');
  assert.match(html,/Confirmări netrimise/);
  assert.match(html,/Trimite confirmările restante/);
  assert.match(html,/confirmationPending/);
  assert.match(html,/\/api\/admin\/confirmation-test/);
  assert.match(html,/action:'send'/);
  assert.match(html,/action:'recover'/);
  assert.match(html,/Trimite confirmarea/);
});

test('admin data reports recoverable confirmation count only for participants with email',()=>{
  const data=read('api/admin/data.js');
  assert.match(data,/confirmationPending/);
  assert.match(data,/x\.email/);
  assert.match(data,/!x\.confirmationEmailSent/);
});
