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
//router.get('/', function(req, res) {
//	res.json({ message: 'Beleza! Bem vindo(a) a nossa Loja XYZ' })
//});

//API's:
//==============================================================================

var appKey = "4poDGohC1kg6jF5wC8f9RKElmcwxsr49";
var token = "o8EDGohC1kjNAzoeTN7dSKVUvbSRRmeE";
var startDate = "2018-11-07T00:00:01";
var endDate = "2018-11-08T23:59:59";
//var lastUpdated = "2018-11-06T12:00:00";

const CronJob = require('cron').CronJob;
//console.log('Cron for every minute');
//console.log('Before job instantiation');
const job = new CronJob('*/30 * * * * *', function() {
	const d = new Date();
	console.log('Every minute:', d);
	var url =
	"https://app.auvo.com.br/api/v1.0/tasks?appKey="+ appKey +"&token="+ token +
	"&startDate="+ startDate +"&endDate="+ endDate; //+ "&lastUpdated=" + lastUpdated;
	//console.log(url);

	const axios = require("axios");
	
	const getAUVO = async url => {
	  try {
		const response = await axios.get(url);
		var data = response.data;
		
		for (var i = 0; i < data.length; i++) {
			var checkIdExistente = await repoFunction.checkIDFromAuvo(data[i].taskID);
			await repoFunction.newFromAuvo(data[i],checkIdExistente);
		}
	  } catch (error) {
		console.log(error);
	  }
	};
	getAUVO(url);

	//var statusNow = "Agendada";
	// Vê no Pipedrive se a visita foi confirmada e atualiza o Auvo
	repoFunction.statusCheck("Confirmação Enviada");
	
	//console.log('oi');

	Tasks.find({ $or: [ { taskStatus: "Agendada" }, { taskStatus: "Confirmação Enviada" }, {taskStatus:"Confirmada"}, {taskStatus:"Lembrete Enviado"}] },function(err, tasks){
		//console.log(tasks);
		if(err){            
		console.log(err);
		}
	}).then(function(tasks){
		for (var i = 0; i < tasks.length; i++) {
			//console.log(tasks[i].taskDate);
			if(tasks[i].taskStatus == "Agendada"){
				repoFunction.checkConfirmation(tasks[i].taskID, tasks[i].dealID, tasks[i].taskDate);
			} else if(tasks[i].taskStatus == "Lembrete Enviado"){
				//a verificação abaixo tem que ser com true, alterado só pra teste
				if(tasks[i].checkOut == true){
					repoFunction.checkOutFromAuvo(tasks[i].taskID, tasks[i].dealID);
					console.log('fez checkout');
				} else	{
					console.log('ainda não fez checkout');
					//apenas para teste
					//repoFunction.checkOutFromAuvo(tasks[i].taskID, tasks[i].dealID);
				}				
			} else {
				repoFunction.checkReminder(tasks[i].taskID, tasks[i].dealID, tasks[i].taskDate);
			}
		}
	})

})


//console.log('After job instantiation');
job.start();


//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);