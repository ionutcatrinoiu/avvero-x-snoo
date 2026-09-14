const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');

test('admin auth and protected API files exist',()=>{
 for(const f of ['api/admin/_auth.js','api/admin/login.js','api/admin/me.js','api/admin/logout.js','api/admin/data.js','api/admin/gift.js']) assert.equal(fs.existsSync(f),true,`${f} missing`);
});

test('admin UI contains required controls and no secrets',()=>{
 assert.equal(fs.existsSync('admin/index.html'),true,'admin/index.html missing');
 const h=fs.readFileSync('admin/index.html','utf8');
 for(const s of ['AUTENTIFICARE','Participanți','Optici medicale','Gestionează miopia','Cunosc Myoless','EXPORT EXCEL','IEȘIRE','Cadou']) assert.ok(h.includes(s),`missing ${s}`);
 for(const secret of ['SNOO_ADMIN_PASSWORD_HASH','SNOO_ADMIN_SESSION_SECRET','SNOO_FIREBASE_ADMIN_CONFIG']) assert.ok(!h.includes(secret),`secret name leaked: ${secret}`);
});

test('public registration remains wired to existing API',()=>{
 const h=fs.readFileSync('index.html','utf8');
 const a=fs.readFileSync('api/register.js','utf8');
 assert.ok(h.includes("fetch('/api/register'"));
 assert.ok(a.includes("collection('snoo_registrations')"));
});
