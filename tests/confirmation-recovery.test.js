const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('admin has one protected confirmation endpoint for individual and bulk recovery',()=>{
  assert.equal(fs.existsSync(path.join(root,'api/admin/confirmation-send.js')),true);
  assert.equal(fs.existsSync(path.join(root,'api/admin/confirmation-recover.js')),false);
  const endpoint=read('api/admin/confirmation-send.js');
  assert.match(endpoint,/readSession/);
  assert.match(endpoint,/sendRegistrationConfirmation/);
  assert.match(endpoint,/body\.bulk===true/);
  assert.match(endpoint,/confirmationEmailSent/);
  assert.match(endpoint,/email/);
});

test('admin dashboard exposes pending count, bulk recovery, and individual send action',()=>{
  const html=read('admin/index.html');
  assert.match(html,/Confirmări netrimise/);
  assert.match(html,/Trimite confirmările restante/);
  assert.match(html,/confirmationPending/);
  assert.match(html,/confirmation-send/);
  assert.doesNotMatch(html,/confirmation-recover/);
  assert.match(html,/bulk:true/);
  assert.match(html,/Trimite confirmarea/);
});

test('admin data reports recoverable confirmation count only for participants with email',()=>{
  const data=read('api/admin/data.js');
  assert.match(data,/confirmationPending/);
  assert.match(data,/x\.email/);
  assert.match(data,/!x\.confirmationEmailSent/);
});
