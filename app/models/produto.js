/**
 * Arquivo: produto.js
 * Author: Glaucia Lemos
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Produto'
 * Data: 18/10/2017
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Produto:
 * 
 * -> Id: int
 * -> Nome: String
 * -> Preco: Number
 * -> Descricao: String
 * 
 */

var ProdutoSchema = new Schema({
    id_garagem: Number,
    lat_garagem: Number,
    long_garagem: Number,
    id_equipto: Number,
    radius: Number,
    ppreco: Array,
    pfrete: Array
});

module.exports = mongoose.model('Produto', ProdutoSchema);