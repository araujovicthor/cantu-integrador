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
var Holidays = require('date-holidays');
var hd = new Holidays();
var wc = require('which-country');

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

//Rotas que terminarem com '/produtos' (servir: GET ALL & POST)
router.route('/produtos')

	/* 1) Método: Criar Produto (acessar em: POST http://localhost:8000/api/produtos)  */
	.post(function(req, res) {
		var produto = new Produto();

		//Aqui vamos setar os campos do produto (via request):
		produto.id_garagem = req.body.id_garagem;
		produto.lat_garagem = req.body.lat_garagem;
		produto.long_garagem= req.body.long_garagem;
		produto.id_equipto = req.body.id_equipto;
		produto.radius = req.body.radius;
		produto.ppreco = req.body.ppreco;
		produto.pfrete = req.body.pfrete;

		
		produto.save(function(error) {
			if(error)
				res.send('Erro ao tentar salvar o Produto....: ' + error);
			
			res.json({ message: 'Produto Cadastrado com Sucesso!' });
		});
	})

	/* 2) Método: Selecionar Todos Produtos (acessar em: GET http://localhost:8000/api/produtos)  
	.get(function(req, res) {
		Produto.find(function(error, produtos) {
			if(error) 
				res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error);

			res.json(produtos);
		});
	});	*/

	//Rotas que irão terminar em '/produtos/:produto_id' (servir tanto para: GET, PUT & DELETE: id):
	router.route('/produtos/:produto_id')

	/* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/produtos/:produto_id) */
	.get(function (req, res) {
		
		//Função para poder Selecionar um determinado produto por ID - irá verificar se caso não encontrar um detemrinado
		//produto pelo id... retorna uma mensagem de error:
		Produto.findById(req.params.produto_id, function(error, produto) {
			if(error)
				res.send('Id do Produto não encontrado....: ' + error);

			res.json(produto);
		});
	})

	/* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/produtos/:produto_id) */
	.put(function(req, res) {

		//Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'Produto':
		Produto.findById(req.params.produto_id, function(error, produto) {
			if (error) 
				res.send("Id do Produto não encontrado....: " + error);

				//Segundo: 
				produto.id_garagem = req.body.id_garagem;
				produto.lat_garagem = req.body.lat_garagem;
				produto.long_garagem = req.body.long_garagem;
				produto.id_equipto = req.body.id_equipto;
				produto.radius = req.body.radius;
				produto.ppreco = req.body.ppreco;
				produto.pfrete = req.body.pfrete;

				//Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
				produto.save(function(error) {
					if(error)
						res.send('Erro ao atualizar o produto....: ' + error);

					res.json({ message: 'Produto atualizado com sucesso!' });
				});
			});
		})

		/* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/produtos/:produto_id) */
		.delete(function(req, res) {
			
			Produto.remove({
				_id: req.params.produto_id
				}, function(error) {
					if (error) 
						res.send("Id do Produto não encontrado....: " + error);

					res.json({ message: 'Produto Excluído com Sucesso!' });
				});
			});


//Rota de Cotação (acessar através: GET: http://localhost:8000/quotation): 
router.post('/quotation', function(req, res) {
	
	/*var url = "https://ws.geonames.org/findNearbyPlaceName?lat="+req.body.latOrder+"&lng="+req.body.lonOrder;
	console.log(url);
	var countryCode = https.get(url).xmlPath().getString("geonames.geoname.countryCode");
	console.log(countryCode);*/



	//Define quantas k garagens mais próximas serão chamadas. PS: k deve ser menor ou igual a quantidade de equipamentos por id no banco
	var kBest;
	var keyEquipto = [];
	var order = null;

	var date1 = new Date(req.body.dtIn);
	date1.setUTCHours(12,0,0,0);
	var date2 = new Date(req.body.dtOut);
	date2.setUTCHours(12,0,0,0);
	var timeDiff = date2.getTime() - date1.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	var country = wc([req.body.lonOrder,req.body.latOrder]);
	//console.log(country);

	hd.init(country);

	if (date1.getUTCDay() === 0 || date1.getUTCDay() === 6 || date2.getUTCDay() === 0 ||date2.getUTCDay() === 6) {
		res.statusCode = 500;
		res.json({ error: "Não é possível entregar ou retirar no final de semana"});
	} else if (hd.isHoliday(date1) != false || hd.isHoliday(date2) != false) {
		res.statusCode = 500;
		res.json({ error: "Não é possível entregar ou retirar em feriados"});
	} else if(diffDays<=0){
		res.statusCode = 500;
		res.json({ error: "Data de devolução é menor ou igual a data de entrega"});
	} else {

		if (diffDays<7) {
			var newDiffDays = diffDays;
			var today = date1;
		for (var i = 0; i < diffDays; i++) {
			var dayWeek = today.getUTCDay();
			var holidays = hd.isHoliday(today);
			if (dayWeek == 0 || dayWeek == 6) {
				newDiffDays--;
			} else if (holidays != false) {
				newDiffDays--;
			}
			var year = today.getFullYear();
			var month = today.getMonth();
			var day = today.getDate()+1;
			today = new Date(year, month, day);
			today.setUTCHours(12,0,0,0);	
		}
		diffDays=newDiffDays;
		}

			function lineDistance(previewObj) {
				var val = organizaDistancia.data.distance(req.body.latOrder, req.body.lonOrder, previewObj.keyEquipto, 
					previewObj.latGarage, previewObj.lonGarage, previewObj.radius); 
				return val;
			}
			
			var organizaDistancia = require('./repoFunction.js');
			organizaDistancia.data.findPreview(req.body.equiptOrder, lineDistance).then(
				function(repLinear){
					kBest = repLinear.length;
					for (var k = 0; k < kBest; k++) {
						keyEquipto[k] = repLinear[k][1];
					}
					matrixDistance = organizaDistancia.data.realDistance(req.body.latOrder, req.body.lonOrder, repLinear, kBest);
					matrixDistance.then((matrixDistance) => {}).catch(function(error) {
						console.log(error);
						res.statusCode = 500;
						res.json({ error: error});
					});
					return matrixDistance;
			}).then(function(moreDetailsProduto){
					finalData = organizaDistancia.data.findAdvanced(moreDetailsProduto, kBest);
					return finalData;
			}).then(function(calculaPreco){
					final = organizaDistancia.data.price(calculaPreco, kBest, diffDays, keyEquipto);;
					order = new Order({
						equiptOrder: req.body.equiptOrder,
						latOrder: req.body.latOrder,
						lonOrder: req.body.lonOrder,
						dtIn: req.body.dtIn,
						dtOut: req.body.dtOut,
						result: final
					});

					order.save(function(error) {
						if(error)
							res.send('Erro ao tentar salvar o Pedido....: ' + error);
					})

					final = JSON.stringify(final, null, "\t")
					res.json(JSON.parse(final));
					return final;
			}).catch(erro => {
				res.statusCode = 500;
				res.json({ error: erro.message})
			});
	};
});
	
//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);
