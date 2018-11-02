/**
 * 
 * Arquivo: server.js
 * Descrição: 
 * Author:
 * Data de Criação: 13/11/2017
 * 
 */

// Configurar o Setup da App:

//Chamadas dos pacotes:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Tasks = require('./app/models/tasks');
var Person = require('./app/models/person');
var https = require("https");
var repoFunction = require('./repoFunction.js');

mongoose.Promise = global.Promise;

//URI: MLab
var dbURI = 'mongodb://cantu:armado17@ds147723.mlab.com:47723/qtyu';
mongoose.connect(dbURI);

//Maneira Local: MongoDb:
/*mongoose.connect('mongodb://localhost:27017/node-crud-api', {
	useMongoClient: true
});*/

//Configuração da variável app para usar o 'bodyParser()':
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definindo a porta onde será executada a nossa api:
var port = process.env.PORT || 5000;

//Rotas da nossa API:
//=============================================================================

//Criando uma instância das Rotas via Express:
var router = express.Router();

//Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão:
router.use(function(req, res, next) {
	console.log('Algo está acontecendo aqui....');
	next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

//Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api): 
router.get('/', function(req, res) {
	res.json({ message: 'Beleza! Bem vindo(a) a nossa Loja XYZ' })
});

//API's:
//==============================================================================

var appKey = "0ANrY1kgphIThAA04S4FiEajGw3ub";
var token = "0ANrY1kgB33FfWZ3URadMJTgcfv";
var startDate = "2018-11-20T00:00:01";
var endDate = "2018-11-20T23:59:59";

const CronJob = require('cron').CronJob;
console.log('Cron for every minute');
console.log('Before job instantiation');
const job = new CronJob('*/5 * * * * *', function() {
	const d = new Date();
	console.log('Every minute:', d);
	var url =
	"https://app.auvo.com.br/api/v1.0/tasks?appKey="+ appKey +"&token="+ token +
	"&startDate="+ startDate +"&endDate="+ endDate;
	
	const axios = require("axios");
	
	const getAUVO = async url => {
	  try {
		const response = await axios.get(url);
		var data = response.data;
		
		for (var i = 0; i < data.length; i++) {
			
			var checkIdExistente = await repoFunction.checkIDFromAuvo(data[i].taskID);
			console.log(checkIdExistente);
			if (checkIdExistente==true) {
				console.log('O taskID já tem cadastrado no banco de dados.');
				console.log('Checando se o checkOut foi realizado...');

				var checkOutRealizado = await repoFunction.checkOutFromAuvo(data[i].checkOut);
				console.log(checkOutRealizado);
				if (checkOutRealizado == true) {
					console.log('CheckOut realizado!');

					console.log('Checando se foi finalizado...');
					var checkFinalizado = await repoFunction.checkFinishedFromAuvo(data[i].finished);
					console.log(checkFinalizado);
					if (checkFinalizado == true) {
						console.log('A Tarefa já foi finalizada!');
						console.log('Não vou fazer nada!');
					} else { 
						console.log('A Tarefa não foi finalizada!');
						console.log('Vou enviar avaliação!');
						console.log('Enviando avaliação...');
					
						console.log('Finalizando tarefa...');
						// repoFunction.editAuvo(data[i].finished); -> só lembrete de atualizar o auvo
					}

				} else { 
					console.log('CheckOut não realizado!');

					console.log('Checando se foi falta menos de 24hs...');
						var checkDate = await repoFunction.checkDateFromAuvo(data[i].taskDate);
						console.log(checkDate);
						if (checkDate == true) {
							console.log('Falta menos de 24hs!');
							
							console.log('Checando se lembrete ja foi enviado...');
							var checkReminder = await repoFunction.checkReminderFromAuvo(data[i].reminder);
							console.log(checkReminder);
								if (checkReminder == true) {
								console.log('O lembrete já foi enviado!');
								console.log('Não vou fazer nada!');
							} else { 
								console.log('Vou enviar o lembrete!');
								console.log('Enviando lembrete...');
								console.log('Gravando no banco que o lembrete foi enviado...');
								//repoFunction.reminderFromAuvo(data[i]);
							}

						} else { 
							console.log('Não falta menos de 24hs!');
							console.log('Não vou fazer nada!');
						}
				}
			} else { 
				console.log('Gravando nova taskID no banco');
				repoFunction.newFromAuvo(data[i]);
			}
		}
	  } catch (error) {
		console.log(error);
	  }
	};
	getAUVO(url);
	

})



//	console.log(tasks);

console.log('After job instantiation');
job.start();




//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);