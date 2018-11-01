var Tasks = require('./app/models/tasks');
var https = require("https");


module.exports = {

	pushAuvo: function () {
		
		//Nenhum npm é necessário para rodar esse fluxo

		var appKey = "0ANrY1kgphIThAA04S4FiEajGw3ub";
		var token = "0ANrY1kgB33FfWZ3URadMJTgcfv";
		var startDate = "2018-10-31T08:00:00";
		var endDate = "2019-10-30T18:00:00";

		var url =
		"https://app.auvo.com.br/api/v1.0/tasks?appKey="+ appKey +"&token="+ token +
		"&startDate="+ startDate +"&endDate="+ endDate;
			
		console.log(url);

		return url;
	},

	checkIDFromAuvo:  function(taskID_Now, callback) {
		return tasks.find({taskID:taskID_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('taksID não encontrado no DB.');
				var check = false;
				return check;
			} else {
				console.log('taksID encontrado no DB.');
				var check = true;
				return check;
			}
		})
		
	},

	checkcheckOutFromAuvo:  function(checkOut_Now, callback) {
		return tasks.find({checkOut:checkOut_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('checkOut da taskID é FALSE');
				var check = false;
				return check;
			} else {
				console.log('checkOut da taskID é TRUE');
				var check = true;
				return check;
			}
		})
		
	},

	editcheckOutFromAuvo:  
	Produto.forEach(function(result4){
		radius.push(result4.radius);
		
		function(checkOut_Now, callback) {
		return tasks.find({checkOut:checkOut_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('checkOut da taskID é FALSE');
				var check = false;
				return check;
			} else {
				console.log('checkOut da taskID é TRUE');
				var check = true;
				return check;
			}
		})
		
	}
};
