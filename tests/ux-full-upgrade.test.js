const fs=require('fs'); const s=fs.readFileSync('index.html','utf8');
const must=[
 ['calendar event date','20261016T160000'],
 ['calendar location','ROMEXPO'],
 ['calendar action','ADAUGĂ ÎN CALENDAR'],
 ['session restore','snooFormDraft'],
 ['autocomplete given-name','autocomplete="given-name"'],
 ['autocomplete family-name','autocomplete="family-name"'],
 ['autocomplete tel','autocomplete="tel"'],
 ['autocomplete email','autocomplete="email"'],
 ['autocomplete street-address','autocomplete="street-address"'],
 ['live validation class','field-valid'],
 ['haptic enhancement','navigator.vibrate'],
 ['participation card','participation-card'],
 ['all-localities expectation','RO_CITIES.length>10000'],
 ['interactive next layer','swipe-next-preview']
];
let fail=0; for(const [name,needle] of must){if(!s.includes(needle)){console.error('FAIL',name);fail++}else console.log('PASS',name)}
if(fail) process.exit(1);
