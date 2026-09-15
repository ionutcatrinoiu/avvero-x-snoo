const {readSession,noStore}=require('./_auth');
const {sendWithResend}=require('../_reminder');
const {EVENT}=require('../_event');
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim());
module.exports=async(req,res)=>{noStore(res);if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});if(!readSession(req))return res.status(401).json({error:'UNAUTHORIZED'});const email=String((req.body||{}).email||'').trim();if(!emailOk(email))return res.status(400).json({error:'INVALID_EMAIL'});try{const data=await sendWithResend({firstName:'Test',participationCode:'SNOO-TEST',event:EVENT},email,`snoo-reminder-test/${Date.now()}`);return res.status(200).json({ok:true,emailId:data&&data.id||null})}catch(e){console.error('reminder test failed',e);return res.status(500).json({error:'REMINDER_TEST_FAILED',message:String(e.message||e).slice(0,200)})}};
