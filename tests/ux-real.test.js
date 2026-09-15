const fs=require('fs'); const s=fs.readFileSync('index.html','utf8');
function ok(x,m){if(!x) throw new Error(m)}
ok(s.includes('function beginInteractiveStepSwipe'), 'real interactive swipe function missing');
ok(s.includes('swipe-preview-step'), 'preview step missing');
ok(s.includes('function validateLiveField'), 'live validation missing');
ok(s.includes('data-valid'), 'valid-state hook missing');
ok(s.includes('nav-success-stack'), 'mobile success stack missing');
ok(s.includes('Bucov'), 'Bucov fallback/locality support missing');
ok(s.includes('progress-fill'), 'new progress fill missing');
console.log('ux-real tests OK');
