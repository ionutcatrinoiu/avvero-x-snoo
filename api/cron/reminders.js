const {isReminderDay,runReminderBatch}=require('../../lib/reminder');
module.exports=async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  if(!process.env.CRON_SECRET||req.headers.authorization!==`Bearer ${process.env.CRON_SECRET}`)return res.status(401).json({error:'UNAUTHORIZED'});
  if(!isReminderDay())return res.status(200).json({ok:true,skipped:true,reason:'NOT_REMINDER_DAY'});
  try{return res.status(200).json({ok:true,...await runReminderBatch()})}catch(e){console.error('reminder cron failed',e);return res.status(500).json({error:'REMINDER_CRON_FAILED'})}
};
