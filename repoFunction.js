var Produto = require('./app/models/produto');
var https = require("https");


var methods = {

	pushAuvo: function () {
		
		//Nenhum npm é necessário para rodar esse fluxo

		var appKey = 0ANrY1kgphIThAA04S4FiEajGw3ub;
		var token = 0ANrY1kgB33FfWZ3URadMJTgcfv;
		var startDate = 2018-10-31T08:00:00;
		var endDate = 2019-10-30T18:00:00;

		var url =
		"https://app.auvo.com.br/api/v1.0/tasks?appKey="+ appKey +"&token="+ token +
		"&startDate="+ startDate +"&endDate="+ endDate;
			
		console.log(url);
	},
};

exports.data = methods;
