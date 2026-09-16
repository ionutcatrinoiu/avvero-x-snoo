const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('recovery reuses the existing confirmation-test endpoint without adding Vercel functions',()=>{
  assert.equal(fs.existsSync(path.join(root,'api/admin/confirmation-send.js')),false);
  assert.equal(fs.existsSync(path.join(root,'api/admin/confirmation-recover.js')),false);
  const api=read('api/admin/confirmation-test.js');
  assert.match(api,/action/);
  assert.match(api,/registrationId/);
  assert.match(api,/sendRegistrationConfirmation/);
  assert.match(api,/recover/);
});

test('admin exposes pending count and both recovery actions through confirmation-test',()=>{
  const html=read('admin/index.html');
  assert.match(html,/Confirmări netrimise/);
  assert.match(html,/Trimite confirmările restante/);
  assert.match(html,/Trimite confirmarea/);
  assert.match(html,/confirmationPending/);
  assert.doesNotMatch(html,/confirmation-send/);
  assert.doesNotMatch(html,/confirmation-recover/);
  assert.match(html,/confirmation-test/);
});

test('admin data counts only recoverable confirmations',()=>{
  const data=read('api/admin/data.js');
  assert.match(data,/confirmationPending/);
  assert.match(data,/x\.email/);
  assert.match(data,/!x\.confirmationEmailSent/);
});
