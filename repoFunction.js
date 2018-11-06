var Tasks = require('./app/models/tasks');
var Person = require('./app/models/person');
var https = require("https");
const axios = require("axios");
var twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

var async = require('async');
var Pipedrive = require("pipedrive");
var pipedrive = new Pipedrive.Client('204369674ebaff427f06a5ab1e4e0bef2fe10c1a', { strictMode: true });
var request = require("request");

module.exports = {
	sendSMSTwilio_Reminder: function (personPhone, address,taskDate, callback) {
		
		const accountSid = 'ACe77c5f758168c9a356897d57b7b84001';
		const authToken = '4d7f1ffd299f2d28ae711be88c0c5e6f';
		const client = require('twilio')(accountSid, authToken);
        
		client.messages
		.create({
			body: 'Lembrete da sua visita ao imóvel no endereço'+ adress + 'na data e horario' + taskDate,
			from: '+12729992601',
			to: '+55'+personPhone
		})
		.then(message => console.log(message.sid))
		.done();

	},

	sendSMSTwilio_Evaluation: function (personPhone, taskID, callback) {
		
		const accountSid = 'ACe77c5f758168c9a356897d57b7b84001';
		const authToken = '4d7f1ffd299f2d28ae711be88c0c5e6f';
		const client = require('twilio')(accountSid, authToken);
        
		client.messages
		.create({
			body: 'Faça uma proposta e avalie o imóvel clicando no link: ' + 'https://docs.google.com/forms/d/e/1FAIpQLSetHqCn5Oe3kStTZJ3qFT_9lbS-Dvlf4zAXGG-KEQxcuyDhkw/viewform?usp=pp_url&entry.725776407='+taskID + 'Atenciosamente, Imobiliária Beiramar!',
			from: '+12729992601',
			to: '+55'+personPhone
		})
		.then(message => console.log(message.sid))
		.done();

	},

	sendEmailSendGridReminder: function (personEmail, address,taskDate, callback) {
		SENDGRID_API_KEY="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";
		sgMail.setApiKey(SENDGRID_API_KEY);
		const msg = {
		to: personEmail,
		from: 'lembrete@cantu.com.br',
		subject: 'Lembrete de visita ao imóvel - Beiramar',
		text: 'Lembrete da sua visita ao imóvel no endereço'+ adress + 'na data e horario' + taskDate,
		html: '<strong>Até lá!</strong>',
		};
		sgMail.send(msg);

		},

	sendEmailSendGridEvaluation: function (personPhone, taskID, callback) {
		SENDGRID_API_KEY="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";
		sgMail.setApiKey(SENDGRID_API_KEY);
		const msg = {
		to: personEmail,
		from: 'lembrete@cantu.com.br',
		subject: 'Lembrete de visita ao imóvel - Beiramar',
		text: 'Faça uma proposta e avalie o imóvel clicando no link: ' + 'https://docs.google.com/forms/d/e/1FAIpQLSetHqCn5Oe3kStTZJ3qFT_9lbS-Dvlf4zAXGG-KEQxcuyDhkw/viewform?usp=pp_url&entry.725776407='+taskID + 'Atenciosamente, Imobiliária Beiramar!',
		html: '<strong>Até lá!</strong>',
		};
		sgMail.send(msg);
		
	},

	pushAuvo: function () {
		
		//Nenhum npm é necessário para rodar esse fluxo

		var appKey = "4poDGohC1kg6jF5wC8f9RKElmcwxsr49";
		var token = "o8EDGohC1kjNAzoeTN7dSKVUvbSRRmeE";
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
				//console.log(taskID_Now + ' não encontrado no DB.');
				var check = false;
				return check;
			} else {
				//console.log(taskID_Now + ' encontrado no DB.');
				var check = true;
				return check;
			}
			//console.log(check);
		})
		
	},

	checkOutFromAuvo: async function(checkOut_Now, callback) {
		return Tasks.find({checkOut:true},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('CheckOut não realizado na verificação da função.');
				var check = false;
				return check;
			} else {
				console.log('CheckOut realizado na verificação da função.');
				var check = true;
				return check;
			}
		})
		
	},

	checkFinishedFromAuvo: async function(finished_Now, callback) {
		return Tasks.find({finished:true},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('Não finalizado na verificação da função.');
				var check = false;
				return check;
			} else {
				console.log('Finalizado na verificação da função.');
				var check = true;
				return check;
			}
			//console.log(check);
		})
		
	},

	checkReminderFromAuvo: async function(reminder_Now, callback) {
		return Tasks.find({reminder:true},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			if (tasks.length === 0) {
				console.log('O lembrete ainda não foi enviado na verificação da função.');
				var check = false;
				return check;
			} else {
				console.log('O lembrete já foi enviado na verificação da função.');
				var check = true;
				return check;
			}
			//console.log(check);
		})
		
	},

	checkDateFromAuvo: async function(date_Now, callback) {
		return Tasks.find({taskDate:date_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			var retdate = new Date();
			retdate.setDate(retdate.getDate()-1);
			var mydatestring = '2016-07-26T09:29:05.00';
			var mydate = new Date(mydatestring);

			var difference = retdate - mydate; // difference in milliseconds

			const TOTAL_MILLISECONDS_IN_A_DAY = 1000 * 60 * 24 * 1;
			console.log(TOTAL_MILLISECONDS_IN_A_DAY);
			if (Math.floor(difference / TOTAL_MILLISECONDS_IN_A_DAY) >= 1) {
				console.log("Ainda falta mais que 24h para a visita na verificação da função.");
				var check = false;
				return check;
			}else {
				console.log('Ainda falta menos que 24h para a visita na verificação da função.');
				var check = true;
				return check;
			}
				
			
		})
		
	},

	
	newFromAuvo: async function (data) {
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
		tasks.reminder = false;
					
		//console.log(data.taskID);
		var person = new Person();
		var sep1 = data.orientation.split("Nome do cliente: ").pop();
		var personName = sep1.split("; Email do cliente: ").shift();
		person.personName = personName;
		var sep1 = data.orientation.split("Email do cliente: ").pop();
		var personEmail = sep1.split("; Telefone do cliente").shift();
		person.personEmail = personEmail;
		var sep1 = data.orientation.split("Telefone do cliente: ").pop();
		var personPhone = sep1.split("; Link do imóvel").shift();
		person.personPhone = personPhone;
		var sep1 = data.orientation.split("Link do imóvel: ").pop();
		var imovelURL = sep1.split("; Status da visita").shift();
		tasks.imovelURL = imovelURL;
		var sep1 = data.orientation.split("/imovel/").pop();
		var codImovel = sep1.split("-").shift();
		tasks.codImovel = codImovel;
		var sep1 = data.orientation.split("Status da visita: ").pop();
		var taskStatus = sep1.split(";").shift();
		tasks.taskStatus = taskStatus;
		person.taskID = data.taskID
		person.save();
		//console.log(codImovel);
		//console.log(data.orientation);
		 
		var options = { method: 'POST',
			url: 'https://beiramarimoveis.com.br/api/imovel/codigo.php',
			headers: 
			{ 'Postman-Token': '6df1ffc0-8b5a-44bf-8215-d16180630015',
				'cache-control': 'no-cache',
				Authorization: '5e6318870c7f3ded5e9e5922fc90e275',
				'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
		   	formData: { codigo: codImovel } };
		 
		request(options, function (error, response, dataBM) {
			if (error) throw new Error(error);
			dataBM = JSON.parse(dataBM);
			//console.log(dataBM[0].id);
			//console.log(dataBM[0].valor);   
			//console.log(dataBM);
			tasks.value = dataBM[0].valor;
		});

		async.waterfall([
			function(callback){
				pipedrive.Persons.add ({name: personName, email: personEmail, phone: personPhone}, function(err, personPipedrive){
				//console.log(personPipedrive);
				callback(null, personPipedrive);
				});
			},
			function (personPipedrive, callback){
				pipedrive.Deals.add ({title: personName, person_id: personPipedrive.id, value: tasks.value}, function(err, dealsPipedrive){
				tasks.dealID = dealsPipedrive.id;
				console.log('Salvando tarefa');
				tasks.save();
				callback(null, dealsPipedrive);
				});   
			},
			function (dealsPipedrive, callback){
				//console.log(person.imovelURL);
				//console.log(dealsPipedrive.id);
				pipedrive.Notes.add ({content: 'Agendou visita para o imóvel: ' + tasks.imovelURL, deal_id: dealsPipedrive.id}, function(err, notesPipedrive){
				//console.log(notesPipedrive);
				console.log('Salvando nota');
				callback(null);
				});   
			}
		
		],function(err){
			console.log('done')
		});

		
	},

	reminderFromAuvo: function (data) {
		var tasks = new Tasks();
		tasks.reminder = true;
			
		tasks.save();

	},

	statusCheck: async function(status_Now, callback) {
		return Tasks.find({taskStatus:status_Now},function(err, tasks){
			if(err){            
			console.log(err);
			}
		}).then(function(tasks) {
			for (var i = 0; i < tasks.length; i++) {
				//console.log(tasks[i].dealID);

				async.waterfall([
					function(callback){
						pipedrive.Deals.get(tasks[i].dealID, function(err, dealPipedrive){
							//console.log(dealPipedrive);
							callback(null, dealPipedrive);
						});
					},
					function(dealPipedrive, callback){
						if(dealPipedrive.pipeline_id == 1 && dealPipedrive.stage_id == 2){
							//console.log("dentro do fluxo");
							
							//console.log(tasks[i].orientation);
							var sep1 = tasks[i].orientation.split("Nome do cliente: ").pop();
							var orientationBase = sep1.split("Agendada;").shift();
							//console.log(orientationBase);

							Tasks.update({dealID: tasks[i].dealID}, {
								taskStatus: "Confirmada",
								orientation: "Nome do cliente: "+ orientationBase + "Confirmada;"
							}, function(err, numberAffected, rawResponse) {
							   //handle it
							})

							var options = { method: 'PUT',
							url: 'https://app.auvo.com.br/api/v1.0/tasks/'+tasks[i].taskID,
							headers: 
								{	 
								'Content-Type': 'application/json' 
								},
							body: 
								{ 
								appKey: '4poDGohC1kg6jF5wC8f9RKElmcwxsr49',
								token: 'o8EDGohC1kjNAzoeTN7dSKVUvbSRRmeE',
								orientation: "Nome do cliente: "+ orientationBase + "Confirmada;"
								},
								json: true };

								request(options, function (error, response, body) {
									if (error) throw new Error(error);
									//console.log(body);
							 	});

						} else {
							console.log('nothing to do');
						}
					callback(null);
					}
				],function(err){
					console.log('Tarefa no Auvo Atualizada')
				});

				//console.log('chegou aqui');
				var check = false;
				return check;
			}			
		})
		
	}

};
