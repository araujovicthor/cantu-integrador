var Produto = require('./app/models/produto');
var https = require("https");


var methods = {

	findPreview: function(equiptOrder, callback) {
		var keyEquipto = [];
		var latGarage = [];
		var lonGarage = [];
		var radius = [];


			return Produto.find({id_equipto:equiptOrder},function(err, Produto){
				if(err){            
				console.log(err);
				}
			}).then(function(Produto) {
				if (Produto.length === 0) {
					throw new Error('ID de equipamento não encontrado no DB.');	
				} else {
					return Produto;
				}
			}).then(function(Produto) {
					Produto.forEach(function(result1){
						keyEquipto.push(result1._id);
					})
					Produto.forEach(function(result2){
						latGarage.push(result2.lat_garagem);
					})
					Produto.forEach(function(result3){
						lonGarage.push(result3.long_garagem);
					})
					Produto.forEach(function(result4){
						radius.push(result4.radius);
					})
					var temp =  callback({
						keyEquipto: keyEquipto,
						latGarage: latGarage,
						lonGarage: lonGarage,
						radius: radius
					});
					return temp;
				});
	},

	findAdvanced: function(matrixRealDistance, kBest){//, callback) {
		var keyEquipto = [];
		var PPreco = [];
		var PFrete = [];
		var idGar = [];
		var finalData = new Array(2); // array 2D
			for (var p = 0; p < 5; p++) {
				finalData[p] = new Array(kBest);
			}

		for (var k = 0; k < kBest; k++) {
				keyEquipto[k] = matrixRealDistance[0][k];
		}
				
		return Produto.find({_id:keyEquipto},function(err, Produto){
				if(err){            
				console.log(err);
				}
			}).then(function(Produto) {
				Produto.forEach(function(result1){
					PPreco.push(result1.ppreco);
				})
				Produto.forEach(function(result2){
					PFrete.push(result2.pfrete);
				})
				Produto.forEach(function(result3){
					idGar.push(result3.id_garagem);
				})
				
				PPreco=PPreco.reverse();
				PFrete=PFrete.reverse();
				idGar=idGar.reverse();

				for (var k = 0; k < kBest; k++) {
					finalData[0][k] = keyEquipto[k];
					finalData[1][k] = matrixRealDistance[1][k];
					finalData[2][k] = PPreco[k];
					finalData[3][k] = PFrete[k];
					finalData[4][k] = idGar[k];
				}

				return finalData;
			});
	},

	distance: function (latOrder, lonOrder, keyEquipto, latGarage, lonGarage, radius) {
		var raio = 6371000; //diametro da terra em metros
		var teta1 = latOrder * (Math.PI / 180);
		var teta2 = [];
		var deltaTeta = [];
		var deltaLambda = [];
		var a = [];
		var c = [];
		var dist = [];

		var distKm = new Array(2); // array 2D
		for (var j = 0; j < 2; j++) {
			distKm[j] = new Array(4);
		}

		for (var i = 0; i < latGarage.length; i++) {
			teta2[i] = latGarage[i] * (Math.PI / 180);

			deltaTeta[i] = (latGarage[i] - latOrder) * (Math.PI / 180);
			deltaLambda[i] = (lonGarage[i] - lonOrder) * (Math.PI / 180);

			a[i] = (Math.sin(deltaTeta[i] / 2) * Math.sin(deltaTeta[i] / 2)) +
				(Math.cos(teta1) * Math.cos(teta2[i]) * Math.sin(deltaLambda[i] / 2) *
					Math.sin(deltaLambda[i] / 2));
			c[i] = 2 * Math.atan2(Math.sqrt(a[i]), Math.sqrt(1 - a[i]));

			dist[i] = raio * c[i]; // metros
			distKm[i] = [];
			distKm[i][0] = dist[i] / 1000; // km
			distKm[i][1] = keyEquipto[i];
			distKm[i][2] = latGarage[i];
			distKm[i][3] = lonGarage[i];
			distKm[i][4] = radius[i];
		}

		distKm.sort(function (a, b) { // organizando do menor até o maior com a primeira coluna
			return a[0] - b[0];
		});

		var select = distKm.length;
		var kRaio = 0;
		for (var i = 0; i < select; i++) {
			if (distKm[i][0]<=distKm[i][4]) {
			kRaio=kRaio+1;
			}	
		}
		var distRadius = new Array(kRaio); // array 2D
		for (var j = 0; j < kRaio; j++) {
			distRadius[j] = new Array(4);
		}

		var xyz = 0;
		for (var i = 0; i < select; i++) {
			if (distKm[i][0]<=distKm[i][4]) {
				distRadius[xyz][0] = distKm[i][0];
				distRadius[xyz][1] = distKm[i][1];
				distRadius[xyz][2] = distKm[i][2];
				distRadius[xyz][3] = distKm[i][3];
				xyz=xyz+1;
			}else{
			}	
		}

		var kBest = distRadius.length;
	

		if (kBest===0) {
			throw new Error('Equipamento não disponível na região solicitada.');
		}else{
		var dkmBest = new Array(kBest); // array 2D
		for (var p = 0; p < kBest; p++) {
			dkmBest[p] = new Array(4);
		}

		for (var k = 0; k < kBest; k++) {
			for (var x = 0; x < 4; x++) {
				dkmBest[k][x] = distRadius[k][x];
			}
		}
		return dkmBest;
		}
	},

	realDistance: function (latOrder, lonOrder, dkmBest, kBest) {
		var matrixDistance = new Array(2); // array 2D
			for (var p = 0; p < 2; p++) {
				matrixDistance[p] = new Array(kBest);
			}

		//Nenhum npm é necessário para rodar esse fluxo

		var origins = [latOrder + ',' + lonOrder];
		var destinations = '';

		if (dkmBest.length > 1) {  // se há mais de um melhor fornecedor, faça:
			for (var g = 0; g < dkmBest.length - 1; g++) {
				destinations += dkmBest[g][2] + ',' + dkmBest[g][3] + '|';
			}

			destinations += dkmBest[dkmBest.length - 1][2] + ',' + dkmBest[dkmBest.length - 1][3];

		} else {
			destinations = [dkmBest[0][2] + ',' + dkmBest[0][3]];
		}

		var url =
			"https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
			origins + "&destinations=" + destinations +
			"&mode=driveing&language=pt-BR&key=AIzaSyCuR3R0SatGXV6rxnjV0tFYQ0i_9nZ7fHw";

			return new Promise(function(resolve, reject){
				https.get(url, connection => {
				    connection.setEncoding("utf8"); // ler dados em encode correto
				    let distances = "";      // variávavel somente para esse block
				    connection.on("data", data => { // ao res começar a receber o data, distance = data;
				      distances += data;
				    });
				    connection.on("end",() => {   // ao res terminar de receber o data, executar fluxo;
				      try {
				      	  distances = JSON.parse(distances);
					      var gmapsDistance = [];
					      for (var z = 0; z < distances.rows[0].elements.length; z++) {
					        gmapsDistance[z] = distances.rows[0].elements[z].distance.value / 1000;
					      }

					      for (var k = 0; k < kBest; k++) {
									matrixDistance[0][k] = dkmBest[k][1];
									matrixDistance[1][k] = gmapsDistance[k];
					      }
						  resolve(matrixDistance);
				      } catch (e) {
				      	reject("Localização do pedido não possui rota de entrega!");
				      }
				      
				    });
				});	
			})
	},

	price: function (finalData, kBest, days, keyEquipto) {
		//var resultado = [];
		var media = 0;

		var calculaPreco = new Array(2); // array 2D
			for (var p = 0; p < 3; p++) {
				calculaPreco[p] = new Array(kBest);
			}
		
		function interpolate(x, vetorInput){
			var sortVetor = vetorInput.sort(function(a, b){return a[0]-b[0]});
			var lArray = sortVetor.length-1;
			var y=0;
			var i=0;

			if (x<sortVetor[0][0]) {
				y=sortVetor[0][1];
			}else if (x>sortVetor[lArray][0]) {
				y=sortVetor[lArray][1];
			}else{
				while(i<=lArray && x>=sortVetor[i][0]){
					if (x==sortVetor[i][0]) {
						y=sortVetor[i][1];
					} else {
					var pointA = [sortVetor[i][0],sortVetor[i][1]];
					var pointB = [sortVetor[i+1][0],sortVetor[i+1][1]];
					var x0 = pointA[0];
					var y0 = pointA[1];
					var x1 = pointB[0];
					var y1 = pointB[1];
					y= y0 + (y1-y0)*((x-x0)/(x1-x0));
					}
				i++;
				}
			}
			return y;
		}

		var garages = [];
		for (var k = 0; k < kBest; k++) {
			calculaPreco[0][k] = days*(interpolate(days, finalData[2][k]));
			var frete = 2*finalData[1][k]*(interpolate(finalData[1][k], finalData[3][k]));
			if (frete <=0) {
				calculaPreco[1][k]=0;
			}else{
				calculaPreco[1][k]=frete;
			}
			calculaPreco[2][k] = calculaPreco[0][k]+calculaPreco[1][k];

			var round=Math.ceil(100*calculaPreco[2][k])/100;
			garages.push({
				id: finalData[4][k],
				price: round
			})
		
			media = media + calculaPreco[2][k];
		}

		
		media = Math.ceil(100*media/kBest)/100;

		var aliciv = 0.08;
		var fmoip = 0.69;
		var vmoip = 0.0299;
		
		var aliimp = 0.06;
		var imposto = media*aliimp;
		var civ = media*aliciv;
		var moip = fmoip+media*vmoip;

		var venda= media + moip + imposto + civ;
		diff = 1.00;

		while (diff > 0.00009) {
			var anterior = venda;
			imposto = (venda-media)*aliimp;
			civ = venda*aliciv;
			moip = fmoip+venda*vmoip;
			venda = media + moip + imposto + civ;
			diff = Math.abs(venda-anterior);
		}

		venda = Math.ceil(100*venda)/100;
		
		var resultado = {data:{prices:{owner:media,full:venda},garages:garages}};
		return resultado;
	},
};

exports.data = methods;
