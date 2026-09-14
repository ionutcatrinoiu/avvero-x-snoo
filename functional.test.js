
const fs=require('fs');
const s=fs.readFileSync(process.argv[2],'utf8');
function ok(v,m){if(!v) throw new Error(m)}
ok(s.includes("submitRegistration"),"missing submitRegistration");
ok(s.includes("fetch('/api/register'"),"missing API submission");
ok(s.includes("gdprConsent:true"),"missing GDPR persistence");
ok(s.includes("role:S.role"),"missing role persistence");
ok(s.includes("streetAddress:S.street"),"missing combined address persistence");
ok(s.includes("class=\"action-primary\""),"missing unified action component");
ok(!s.includes("class=\"gdpr-continue\""),"legacy GDPR button still present");
console.log("PASS");
