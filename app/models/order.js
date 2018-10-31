/**
 * Arquivo: produto.js
 * Author: Glaucia Lemos
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Produto'
 * Data: 18/10/2017
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    equiptOrder: Number,
    latOrder: Number,
    lonOrder: Number,
    dtIn: Date,
    dtOut: Date,
    result: {
	    data: {
	        prices: {
	            owner: Number,
	            full: Number
	        },
	        garages: [
	            {
	                id: Number,
	                price: Number
	            }
	        ]
	    }
	}
});

module.exports = mongoose.model('Order', OrderSchema);