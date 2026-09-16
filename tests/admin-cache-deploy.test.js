const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');

test('deployment disables cache for admin UI without adding recovery functions',()=>{
  const cfg=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
  const headers=cfg.headers||[];
  const adminHeader=headers.find(x=>x.source==='/admin' || x.source==='/admin/(.*)');
  assert.ok(adminHeader,'admin cache header missing');
  assert.ok((adminHeader.headers||[]).some(h=>h.key.toLowerCase()==='cache-control' && /no-store/.test(h.value)),'admin must be no-store');
  assert.equal(cfg.functions['api/admin/confirmation-send.js'],undefined);
  assert.equal(cfg.functions['api/admin/confirmation-recover.js'],undefined);
  assert.ok(cfg.functions['api/admin/confirmation-test.js'],'existing confirmation endpoint must remain configured');
});
