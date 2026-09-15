const fs=require('fs'); const s=fs.readFileSync(process.argv[2]||'index.html','utf8');
function ok(c,m){if(!c)throw new Error(m)}
ok(!s.includes('field.onblur=mobileFieldBlurAdvance'),'text blur auto-advance must be removed');
ok(!s.includes('setTimeout(()=>choiceForward(),180)'),'legacy choice timer must be removed');
ok(s.includes("function pick(v,b)") && s.includes('choiceForward()'),'selection itself must remain able to advance');
ok(s.includes('function showCitySuggestions'),'custom city suggestions missing');
ok(!s.includes("list=\"cityList\""),'native city datalist must be removed');
ok(s.includes('.city-suggestions'),'city dropdown styling missing');
ok(s.includes('background:#f1f0eb'),'city dropdown must match form background');
ok(s.includes('if(n===0){S.gdpr=false;render();return}'),'first-name back must return to GDPR');
ok(s.includes('final-success-actions desktop-final') && !s.includes('desktop-final\"><button class="action-primary" onclick="addToCalendar'),'desktop calendar must be removed');
ok(s.includes('mobile-final') && s.includes('ADAUGĂ ÎN CALENDAR'),'mobile calendar must remain');
console.log('stabilization final tests OK');
