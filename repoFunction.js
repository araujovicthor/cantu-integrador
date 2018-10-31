var Produto = require('./app/models/produto');
var https = require("https");


var methods = {

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
};

exports.data = methods;
