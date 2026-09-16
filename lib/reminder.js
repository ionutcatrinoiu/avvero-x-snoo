const {EVENT}=require('./event');
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function localYmd(date=new Date()){
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:EVENT.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const o=Object.fromEntries(p.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return `${o.year}-${o.month}-${o.day}`;
}
function dayBefore(ymd){const [y,m,d]=ymd.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d));x.setUTCDate(x.getUTCDate()-1);return x.toISOString().slice(0,10)}
function isReminderDay(now=new Date()){return localYmd(now)===dayBefore(EVENT.date)}
function reminderKey(id){return `snoo-2026-reminder/${String(id).replace(/[^a-zA-Z0-9_-]/g,'_')}/${EVENT.date}`}
function confirmationKey(id){return `snoo-2026-confirmation/${String(id).replace(/[^a-zA-Z0-9_-]/g,'_')}`}
const logoUrl='https://avvero-x-snoo.vercel.app/avvero-logo-secundar.png';
function shell(content){return `<!doctype html><html lang="ro"><body style="margin:0;background:#f1f0eb;color:#162325;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f0eb;padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#f7f6f2;border:1px solid #d5d7d2;border-radius:24px"><tr><td style="padding:38px 36px"><img src="${logoUrl}" alt="Avvero" width="170" style="display:block;width:170px;max-width:48%;height:auto;margin:0 0 28px"><div style="font-size:11px;letter-spacing:3px;color:#697371;font-weight:700">AVVERO × SNOO 2026</div>${content}</td></tr></table></td></tr></table></body></html>`}
function eventBox(){return `<div style="margin:26px 0;padding:22px;border:1px solid #d5d7d2;border-radius:18px"><p style="margin:0 0 8px"><strong>Data:</strong> vineri, 16 octombrie 2026</p><p style="margin:0 0 8px"><strong>Ora:</strong> ${esc(EVENT.time)}</p><p style="margin:0"><strong>Locația:</strong> ${esc(EVENT.location)}</p></div>`}
function renderReminderEmail(r={}){
  const first=esc(r.firstName||'');const code=esc(r.participationCode||'');
  return shell(`<h1 style="font-size:34px;line-height:1.08;margin:20px 0 14px">Ne vedem mâine la SNOO 2026!</h1><p style="font-size:17px;line-height:1.55;margin:0 0 22px">Bună${first?', '+first:''},</p><p style="font-size:17px;line-height:1.55">Îți reamintim că mâine te așteptăm la prezentarea Avvero:</p><p style="font-size:21px;line-height:1.35;font-weight:700">${esc(EVENT.title)}</p>${eventBox()}${code?`<p style="font-size:16px">Codul tău de participare: <strong style="letter-spacing:2px">${code}</strong></p>`:''}<p style="font-size:17px;line-height:1.55;margin-top:24px">Și nu uita: avem pregătit pentru tine și un <strong>cadou surpriză Avvero</strong>.</p><p style="color:#697371;margin-top:32px">Echipa Avvero</p>`);
}
function renderConfirmationEmail(r={}){
  const first=esc(r.firstName||'');const code=esc(r.participationCode||'');
  return shell(`<h1 style="font-size:34px;line-height:1.08;margin:20px 0 14px">Înscriere confirmată. Ne vedem la SNOO 2026!</h1><p style="font-size:17px;line-height:1.55;margin:0 0 22px">Bună${first?', '+first:''},</p><p style="font-size:17px;line-height:1.55">Îți mulțumim pentru înscriere la prezentarea Avvero:</p><p style="font-size:21px;line-height:1.35;font-weight:700">${esc(EVENT.title)}</p>${eventBox()}${code?`<p style="font-size:16px">Codul tău de participare: <strong style="letter-spacing:2px">${code}</strong></p>`:''}<p style="font-size:17px;line-height:1.55">Păstrează acest email. Codul de participare ne va ajuta să te identificăm la eveniment.</p><p style="font-size:17px;line-height:1.55;margin-top:24px">Și nu uita: am pregătit pentru tine un <strong>cadou surpriză Avvero</strong>.</p><p style="font-size:17px;line-height:1.55;margin-top:24px">Ne vedem la SNOO 2026!</p><p style="color:#697371;margin-top:32px">Echipa Avvero</p>`);
}

function renderReminderText(r={}){
  const first=String(r.firstName||'').trim();const code=String(r.participationCode||'').trim();
  return [`Bună${first?', '+first:''},`,'',`Îți reamintim că mâine te așteptăm la prezentarea Avvero:`,EVENT.title,'',`Data: vineri, 16 octombrie 2026`,`Ora: ${EVENT.time}`,`Locația: ${EVENT.location}`,code?`Codul tău de participare: ${code}`:'','',`Avem pregătit pentru tine și un cadou surpriză Avvero.`,'','Echipa Avvero'].filter(Boolean).join('\n');
}
function renderConfirmationText(r={}){
  const first=String(r.firstName||'').trim();const code=String(r.participationCode||'').trim();
  return [`Bună${first?', '+first:''},`,'',`Îți mulțumim pentru înscriere la prezentarea Avvero:`,EVENT.title,'',`Data: vineri, 16 octombrie 2026`,`Ora: ${EVENT.time}`,`Locația: ${EVENT.location}`,code?`Codul tău de participare: ${code}`:'','',`Păstrează acest email. Codul de participare ne va ajuta să te identificăm la eveniment.`,`Am pregătit pentru tine un cadou surpriză Avvero.`,'',`Ne vedem la SNOO 2026!`,'','Echipa Avvero'].filter(Boolean).join('\n');
}
function sender(){
  const email=String(process.env.SNOO_BREVO_SENDER_EMAIL||'').trim();
  if(!email)throw new Error('SNOO_BREVO_SENDER_EMAIL is not configured');
  return {name:'AVVERO x SNOO 2026',email};
}
async function sendWithBrevo({to,name='',subject,html,text,key}){
  if(!process.env.BREVO_API_KEY)throw new Error('BREVO_API_KEY is not configured');
  const response=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{accept:'application/json','content-type':'application/json','api-key':process.env.BREVO_API_KEY},body:JSON.stringify({sender:sender(),replyTo:sender(),to:[{email:to,name}],subject,htmlContent:html,textContent:text,headers:key?{'Idempotency-Key':key}:undefined})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.message||data.code||`BREVO_HTTP_${response.status}`);
  return data;
}
async function sendReminder(r,to,key){return sendWithBrevo({to:to||r.email,name:[r.firstName,r.lastName].filter(Boolean).join(' '),subject:'Ne vedem mâine la SNOO 2026!',html:renderReminderEmail(r),text:renderReminderText(r),key})}
async function sendConfirmation(r,to,key){return sendWithBrevo({to:to||r.email,name:[r.firstName,r.lastName].filter(Boolean).join(' '),subject:'Înscriere confirmată la SNOO 2026',html:renderConfirmationEmail(r),text:renderConfirmationText(r),key})}
async function sendRegistrationConfirmation(docRef){
  const {admin}=require('./firebase');
  const snap=await docRef.get();if(!snap.exists)return {skipped:true};const r=snap.data();
  if(!r.email||r.confirmationEmailSent===true)return {skipped:true};
  try{const data=await sendConfirmation(r,r.email,confirmationKey(docRef.id));await docRef.update({confirmationEmailSent:true,confirmationEmailSentAt:admin.firestore.FieldValue.serverTimestamp(),confirmationEmailId:data&&data.messageId||null,confirmationEmailError:admin.firestore.FieldValue.delete()});return {sent:true,id:data&&data.messageId||null}}
  catch(e){await docRef.update({confirmationEmailSent:false,confirmationEmailLastAttemptAt:admin.firestore.FieldValue.serverTimestamp(),confirmationEmailError:String(e.message||e).slice(0,500)}).catch(()=>{});throw e}
}
async function sendParticipantReminder(doc){
  const {admin}=require('./firebase');
  const r=doc.data();if(!r.email||r.reminderSent===true)return {skipped:true};
  try{const data=await sendReminder(r,r.email,reminderKey(doc.id));await doc.ref.update({reminderSent:true,reminderSentAt:admin.firestore.FieldValue.serverTimestamp(),reminderEmailId:data&&data.messageId||null,reminderError:admin.firestore.FieldValue.delete()});return {sent:true,id:data&&data.messageId||null}}
  catch(e){await doc.ref.update({reminderSent:false,reminderLastAttemptAt:admin.firestore.FieldValue.serverTimestamp(),reminderError:String(e.message||e).slice(0,500)}).catch(()=>{});return {error:String(e.message||e)}}
}
async function runReminderBatch(){const {getFirestore}=require('./firebase');const snap=await getFirestore().collection('snoo_registrations').get();let sent=0,skipped=0,errors=0;for(const doc of snap.docs){const r=await sendParticipantReminder(doc);if(r.sent)sent++;else if(r.error)errors++;else skipped++}return {total:snap.size,sent,skipped,errors}}
module.exports={localYmd,dayBefore,isReminderDay,reminderKey,confirmationKey,renderReminderEmail,renderConfirmationEmail,renderReminderText,renderConfirmationText,sendWithBrevo,sendReminder,sendConfirmation,sendRegistrationConfirmation,sendParticipantReminder,runReminderBatch};
