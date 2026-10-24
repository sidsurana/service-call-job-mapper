export default function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'POST required'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{return res.status(400).json({error:'Invalid JSON'})}
 if(!b.event_id||req.headers['idempotency-key']!==b.event_id||!b.customer||!['plumbing','hvac','roofing'].includes(b.trade)||!/^\d{5}$/.test(b.zip)||!Number.isFinite(Date.parse(b.scheduled_at)))return res.status(400).json({error:'Invalid mock CRM payload or missing matching idempotency key'});
 if(!Number.isInteger(b.attempt)||b.attempt<1||b.attempt>3)return res.status(400).json({error:'Attempt must be 1–3'});
 if(b.attempt<3)return res.status(503).json({error:'Intentional synthetic transient failure',retryable:true});
 return res.status(200).json({job_id:'MOCK-'+b.event_id,status:'accepted-fixture',durability:'none; client maintains demo idempotency ledger'});
}
