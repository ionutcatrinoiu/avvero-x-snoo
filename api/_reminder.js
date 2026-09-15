const {EVENT}=require('./_event');
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function localYmd(date=new Date()){
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:EVENT.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const o=Object.fromEntries(p.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return `${o.year}-${o.month}-${o.day}`;
}
function dayBefore(ymd){const [y,m,d]=ymd.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d));x.setUTCDate(x.getUTCDate()-1);return x.toISOString().slice(0,10)}
function isReminderDay(now=new Date()){return localYmd(now)===dayBefore(EVENT.date)}
function reminderKey(id){return `snoo-2026-reminder/${String(id).replace(/[^a-zA-Z0-9_-]/g,'_')}/${EVENT.date}`}
function renderReminderEmail(r={}){
  const first=esc(r.firstName||'');const code=esc(r.participationCode||'');
  return `<!doctype html><html lang="ro"><body style="margin:0;background:#f1f0eb;color:#162325;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f0eb;padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#f7f6f2;border:1px solid #d5d7d2;border-radius:24px"><tr><td style="padding:38px 36px"><div style="font-size:11px;letter-spacing:3px;color:#697371;font-weight:700">AVVERO × SNOO 2026</div><h1 style="font-size:34px;line-height:1.08;margin:20px 0 14px">Ne vedem mâine la SNOO 2026!</h1><p style="font-size:17px;line-height:1.55;margin:0 0 22px">Bună${first?', '+first:''},</p><p style="font-size:17px;line-height:1.55">Îți reamintim că mâine te așteptăm la prezentarea Avvero:</p><p style="font-size:21px;line-height:1.35;font-weight:700">${esc(EVENT.title)}</p><div style="margin:26px 0;padding:22px;border:1px solid #d5d7d2;border-radius:18px"><p style="margin:0 0 8px"><strong>Data:</strong> vineri, 16 octombrie 2026</p><p style="margin:0 0 8px"><strong>Ora:</strong> ${esc(EVENT.time)}</p><p style="margin:0"><strong>Locația:</strong> ${esc(EVENT.location)}</p></div>${code?`<p style="font-size:16px">Codul tău de participare: <strong style="letter-spacing:2px">${code}</strong></p>`:''}<p style="font-size:17px;line-height:1.55;margin-top:24px">Și nu uita: avem pregătit pentru tine și un <strong>cadou surpriză Avvero</strong>.</p><p style="color:#697371;margin-top:32px">Echipa Avvero</p></td></tr></table></td></tr></table></body></html>`;
}
function emailPayload(r,to){return {from:process.env.SNOO_REMINDER_FROM||'',to:[to||r.email],subject:'Ne vedem mâine la SNOO 2026!',html:renderReminderEmail(r)}}
async function sendWithResend(r,to,key){
  if(!process.env.RESEND_API_KEY)throw new Error('RESEND_API_KEY is not configured');
  if(!process.env.SNOO_REMINDER_FROM)throw new Error('SNOO_REMINDER_FROM is not configured');
  const {Resend}=require('resend');const resend=new Resend(process.env.RESEND_API_KEY);
  const result=await resend.emails.send(emailPayload(r,to),{idempotencyKey:key});
  if(result.error)throw new Error(result.error.message||'RESEND_FAILED');
  return result.data;
}
async function sendParticipantReminder(doc){
  const {admin}=require('./admin/_firebase');
  const r=doc.data();if(!r.email||r.reminderSent===true)return {skipped:true};
  try{
    const data=await sendWithResend(r,r.email,reminderKey(doc.id));
    await doc.ref.update({reminderSent:true,reminderSentAt:admin.firestore.FieldValue.serverTimestamp(),reminderEmailId:data&&data.id||null,reminderError:admin.firestore.FieldValue.delete()});
    return {sent:true,id:data&&data.id||null};
  }catch(e){
    await doc.ref.update({reminderSent:false,reminderLastAttemptAt:admin.firestore.FieldValue.serverTimestamp(),reminderError:String(e.message||e).slice(0,500)}).catch(()=>{});
    return {error:String(e.message||e)};
  }
}
async function runReminderBatch(){
  const {getFirestore}=require('./admin/_firebase');
  const snap=await getFirestore().collection('snoo_registrations').get();let sent=0,skipped=0,errors=0;
  for(const doc of snap.docs){const r=await sendParticipantReminder(doc);if(r.sent)sent++;else if(r.error)errors++;else skipped++}
  return {total:snap.size,sent,skipped,errors};
}
module.exports={localYmd,dayBefore,isReminderDay,reminderKey,renderReminderEmail,emailPayload,sendWithResend,sendParticipantReminder,runReminderBatch};
