const test=require('node:test');const assert=require('node:assert/strict');const crypto=require('crypto');
process.env.SNOO_ADMIN_SESSION_SECRET='x'.repeat(64);
const auth=require('../api/admin/_auth');
function hash(p,s='testsalt'){return new Promise((resolve,reject)=>crypto.scrypt(p,s,32,(e,k)=>e?reject(e):resolve(`${s}:${k.toString('hex')}`)))}
test('password hash verifies correct password only',async()=>{const h=await hash('secret-pass');assert.equal(await auth.verifyPassword('secret-pass',h),true);assert.equal(await auth.verifyPassword('wrong',h),false)});
test('session verifies and tampering is rejected',()=>{const t=auth.createSession('admin');assert.equal(auth.verifySession(t).u,'admin');assert.equal(auth.verifySession(t+'x'),null)});
test('session cookie is secure and HttpOnly',()=>{let v='';const res={setHeader:(k,x)=>{if(k==='Set-Cookie')v=x}};auth.setSessionCookie(res,'abc');for(const part of ['HttpOnly','Secure','SameSite=Strict','Path=/'])assert.ok(v.includes(part))});
