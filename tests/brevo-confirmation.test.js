const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

test('email module uses Brevo transactional API and no Resend dependency',()=>{
  const p=path.join(root,'api','_reminder.js');
  const s=fs.readFileSync(p,'utf8');
  assert.match(s,/api\.brevo\.com\/v3\/smtp\/email/);
  assert.match(s,/BREVO_API_KEY/);
  assert.doesNotMatch(s,/RESEND_API_KEY|require\(['"]resend['"]\)/);
});

test('confirmation email exists, includes Avvero logo and participation code',()=>{
  const s=fs.readFileSync(path.join(root,'api','_reminder.js'),'utf8');
  assert.match(s,/renderConfirmationEmail/);
  assert.match(s,/avvero-logo-secundar\.png/);
  assert.match(s,/participationCode/);
  assert.match(s,/Înscriere confirmată/);
});

test('registration records and sends confirmation without making registration fail',()=>{
  const s=fs.readFileSync(path.join(root,'api','register.js'),'utf8');
  assert.match(s,/confirmationEmailSent:false/);
  assert.match(s,/sendRegistrationConfirmation/);
  assert.match(s,/\.catch\(/);
});

test('admin exposes confirmation and reminder statuses separately',()=>{
  const data=fs.readFileSync(path.join(root,'api','admin','data.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'admin','index.html'),'utf8');
  assert.match(data,/confirmationEmailSent/);
  assert.match(data,/confirmationEmailError/);
  assert.match(html,/Confirmare/);
  assert.match(html,/Reminder/);
  assert.match(html,/Trimite confirmare de test/);
});

test('package no longer depends on resend',()=>{
  const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
  assert.equal(pkg.dependencies.resend,undefined);
});

test('email branding uses secondary logo, AVVERO x SNOO 2026 sender name, and final event title punctuation',()=>{
  const reminder=fs.readFileSync(path.join(root,'api','_reminder.js'),'utf8');
  const event=fs.readFileSync(path.join(root,'api','_event.js'),'utf8');
  assert.match(reminder,/avvero-logo-secundar\.png/);
  assert.match(reminder,/name:'AVVERO x SNOO 2026'/);
  assert.match(event,/Managementul miopiei dincolo de lentilă\. Cum educăm o generație să vadă mai bine/);
});
