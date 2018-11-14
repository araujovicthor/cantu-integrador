var Tasks = require('./app/models/tasks');
var Person = require('./app/models/person');
var https = require("https");
const axios = require("axios");
var async = require('async');
var Pipedrive = require("pipedrive");
var pipedrive = new Pipedrive.Client('0172f3b248eb7e489ba324c54e6c921da05733de', { strictMode: true });
var request = require("request");

module.exports = {

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

	checkOutFromAuvo: async function(auvoID, pipedriveID) {
		pipedrive.Deals.update (pipedriveID, {stage_id: 6}, function(err, dealsPipedrive){
		});

		Tasks.findOne({taskID: auvoID}, function (err, tasks) {
			if (err) return console.log(err);
			tasks.taskStatus = "Visita Realizada";
			tasks.save();
		});

		var options = { method: 'PUT',
			url: 'https://app.auvo.com.br/api/v1.0/tasks/'+ auvoID,
			headers: 
			{	 
				'Content-Type': 'application/json' 
			},
			body: 
			{ 
				//criar nova conta de teste na Auvo
				appKey: 'mI4A71BK1khorvhSawivTZWgkCfbK8YM',
				token: 'mI4A71BK1khUxdEbxNvTYm0U1XKFa0A',
				closeTask: true
			},
			json: true 
		};

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			//console.log(body);
		});
	},

	checkConfirmation: async function(auvoID, pipedriveID, mydatestring) {
		var retdate = new Date();
		retdate.setDate(retdate.getDate());
		var mydate = new Date(mydatestring);

		var difference = mydate - retdate; // difference in milliseconds ok

		const TOTAL_MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

		//o sinal dentro do if deve ser >= para que a função esteja correta, está invertido só para teste
		if (difference / TOTAL_MILLISECONDS_IN_A_DAY >= 1) {
			console.log("Mais que 24h para a visita na verificação da função. Nada a fazer.");
		} else {
			console.log("Falta menos que 24h para a visita. Enviar Confirmação.");
			pipedrive.Deals.update (pipedriveID, {stage_id: 3}, function(err, dealsPipedrive){
			});
			Tasks.findOne({taskID: auvoID}, function (err, tasks) {
				if (err) return console.log(err);
				tasks.taskStatus = "Confirmação Enviada";
				tasks.save();
			});
		}
	},

	checkReminder: async function(auvoID, pipedriveID, mydatestring) {
		var retdate = new Date();
		retdate.setDate(retdate.getDate());
		var mydate = new Date(mydatestring);

		var difference = mydate - retdate; // difference in milliseconds

		const TOTAL_MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

		//o sinal dentro do if deve ser >= para que a função esteja correta, está invertido só para teste
		if (difference / TOTAL_MILLISECONDS_IN_A_DAY >= .125) {
			console.log("Mais que 3h para a visita na verificação da função. Nada a fazer.");
		}else {
			console.log("Falta menos que 3h para a visita. Enviar Lembrete.");
			pipedrive.Deals.update (pipedriveID, {stage_id: 5}, function(err, dealsPipedrive){
			});
			Tasks.findOne({taskID: auvoID}, function (err, tasks) {
				if (err) return console.log(err);
				tasks.taskStatus = "Lembrete Enviado";
				tasks.save();
			});
		}
	},
	
	newFromAuvo: async function (data, update_new) {
		
		if(update_new == true){
			Tasks.findOne({taskID: data.taskID}, function (err, tasks) {
				if (err) return console.log(err);
							  
				tasks.taskDate = data.taskDate;
				tasks.finished = data.finished;
				tasks.checkOut = data.checkOut;
				tasks.save();
			});
		}else{
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
			
			var sep1 = data.orientation.split("/imovel/").pop();
			var codImovel = sep1.split("-").shift();

			var sep1 = data.orientation.split("Status da visita: ").pop();
			var taskStatus = sep1.split(";").shift();

			person.taskID = data.taskID
			person.save();
			
			var options = { method: 'POST',
				url: 'https://beiramarimoveis.com.br/api/imovel/codigo.php',
				headers: 
				{ 'Postman-Token': '6df1ffc0-8b5a-44bf-8215-d16180630015',
					'cache-control': 'no-cache',
					Authorization: '5e6318870c7f3ded5e9e5922fc90e275',
					'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
				formData: { codigo: codImovel } };
			
			var tasks = new Tasks();

			request(options, function (error, response, dataBM) {
				if (error) throw new Error(error);
				dataBM = JSON.parse(dataBM);
				tasks.value = dataBM[0].valor;
				//alterar no futuro para identificar de qual imobiliária é o imóvel
				tasks.company = "Beiramar";
			});

			var appKey= 'mI4A71BK1khorvhSawivTZWgkCfbK8YM';
			var token= 'mI4A71BK1khUxdEbxNvTYm0U1XKFa0A';

			request('https://app.auvo.com.br/api/v1.0/users/'+data.idUserTo+'?appkey='+appKey+'&token='+token, function (error, response, body) {
  				//console.log('Status:', response.statusCode);
  				//console.log('Headers:', JSON.stringify(response.headers));
				//console.log('Response:', body);
				body = JSON.parse(body);
				tasks.brokerName = body.name;
				tasks.brokerPhone = body.smartPhoneNumber;  
			});

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
			tasks.visualized = data.visualized;
			tasks.visualizedDate = data.visualizedDate;
			tasks.checkIn = data.checkIn;
			tasks.checkInDate = data.checkInDate;
			tasks.checkOut = data.checkOut;
			tasks.checkOutDate = data.checkOutDate;
			tasks.checkinManual = data.checkinManual;
			tasks.reminder = false;
			tasks.imovelURL = imovelURL;
			tasks.codImovel = codImovel;
			tasks.taskStatus = taskStatus;
			


			async.waterfall([
				function(callback){
					pipedrive.Persons.add ({name: personName, email: personEmail, phone: personPhone}, function(err, personPipedrive){
					callback(null, personPipedrive);
					});
				},
				function (personPipedrive, callback){
					pipedrive.Deals.add ({title: tasks.taskID, person_id: personPipedrive.id, value: tasks.value, stage_id: 2, '47ecfa61caef73390778cdb331cee42edf145343': tasks.taskDate, '5cd0af21123a69d407aa94cd7027d3b129cc5bd0': tasks.address, 'c979f2a014f340ec8788fa795b67955a23cfc8d8': tasks.imovelURL, 'a41ea2865911a717310c81a5b5a25616d4ad252b': tasks.company, '6d5bd1673d4cdaa3773ae8055efbf06a13959157': tasks.brokerName, '4c80ed1f887baee0afaf2672cb1b2081782b8bc4': tasks.brokerPhone}, function(err, dealsPipedrive){
					tasks.dealID = dealsPipedrive.id;
					console.log('Salvando tarefa');
					tasks.save();
					callback(null, dealsPipedrive);
					});   
				},
				function (dealsPipedrive, callback){
					pipedrive.Notes.add ({content: 'Agendou visita para o imóvel: ' + tasks.imovelURL, deal_id: dealsPipedrive.id}, function(err, notesPipedrive){
					console.log('Salvando nota');
					callback(null);
					});   
				}
			
			],function(err){
				console.log('done')
			});
		}
		
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
						if(dealPipedrive.pipeline_id == 1 && dealPipedrive.stage_id == 4){
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
								appKey: 'mI4A71BK1khorvhSawivTZWgkCfbK8YM',
								token: 'mI4A71BK1khUxdEbxNvTYm0U1XKFa0A',
								orientation: "Nome do cliente: "+ orientationBase + "Confirmada;"
								},
								json: true 
							};

							request(options, function (error, response, body) {
								if (error) throw new Error(error);
								//console.log(body);
							});

						} else {
							console.log('Não houve avanço no Pipedrive para atualizar no Auvo');
						}
					callback(null);
					}
				],function(err){
					console.log('Não foi possível atualizar no Auvo')
				});

				//console.log('chegou aqui');
				var check = false;
				return check;
			}			
		})
		
	}

};
