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
var Produto = require('./app/models/produto');
var Order = require('./app/models/order');
var https = require("https");

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
var startDate = "2018-10-31T08:00:00";
var endDate = "2019-10-30T18:00:00";

const CronJob = require('cron').CronJob;
console.log('Cron for every minute');
console.log('Before job instantiation');
const job = new CronJob('*/5 * * * * *', function() {
	const d = new Date();
	console.log('Every minute:', d);
	var url =
	"https://app.auvo.com.br/api/v1.0/tasks?appKey="+ appKey +"&token="+ token +
	"&startDate="+ startDate +"&endDate="+ endDate;
	//console.log(url);

	https.get(url, connection => {
		connection.setEncoding("utf8"); // ler dados em encode correto
		let tasks = "";      // variávavel somente para esse block
		connection.on("data", data => { // ao res começar a receber o data, distance = data;
			tasks += data;
		});
		connection.on("end",() => {   // ao res terminar de receber o data, executar fluxo;
		  	try {
				tasks = JSON.parse(tasks);
			} catch (e) {
			  	reject("Localização do pedido não possui rota de entrega!");
		  	}
		});
	});	
})

	console.log(tasks);

console.log('After job instantiation');
job.start();




//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);