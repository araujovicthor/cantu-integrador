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

	checkIDFromAuvo: async function(taskID_Now, callback) {
		return Tasks.find({taskID:taskID_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log(taskID_Now + ' não encontrado no DB.');
				var check = false;
				return check;
			} else {
				console.log(taskID_Now + ' encontrado no DB.');
				var check = true;
				return check;
			}
			//console.log(check);
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

	newFromAuvo: function (data) {
		var tasks = new Tasks();
		tasks.taskID = data.taskID;
		tasks.idUserFrom = data.idUserFrom;
		tasks.idUserTo = data.idUserTo;
    	tasks.customerId = data.customerId;
    	tasks.creationDate = data.creationDate;
    	tasks.taskDate = data.taskDate;
    	tasks.latitude = data.latitude;
    	tasks.longitude = data.longitude;
    	tasks.address = data.address;
    	tasks.orientation = data.orientation;
    	tasks.priority = data.priority;
    	tasks.deliveredOnSmarthPhone = data.deliveredOnSmarthPhone;
    	tasks.deliveredDate = data.deliveredDate;
    	tasks.finished = data.finished;
    	tasks.report = data.report;
    	tasks.visualized = data.visualized;
    	tasks.visualizedDate = data.visualizedDate;
    	tasks.checkIn = data.checkIn;
    	tasks.checkInDate = data.checkInDate;
    	tasks.checkOut = data.checkOut;
    	tasks.checkOutDate = data.checkOutDate;
    	tasks.checkinManual = data.checkinManual;
    	tasks.signatureBase64 = data.signatureBase64;
    	tasks.attachmentsBase64 = data.attachmentsBase64;
		tasks.checkList = data.checkList;
					
		tasks.save();

		console.log(data.taskID);
	}
};
