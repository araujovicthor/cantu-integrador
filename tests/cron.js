const CronJob = require('cron').CronJob;
console.log('Cron for every minute');
console.log('Before job instantiation');
const job = new CronJob('59 * * * * *', function() {
	const d = new Date();
	console.log('Every minute:', d);
});
console.log('After job instantiation');
job.start();
