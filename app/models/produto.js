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
    taskId: Number,
    idUserFrom: Number,
    idUserTo: Number,
    customerId: Number,
    creationDate: Date,
    taskDate: Date,
    latitude: Number,
    longitude: Number,
    address: String,
    orientation: String,
    priority: Number,
    deliveredOnSmarthPhone: Boolean,
    deliveredDate: Date,
    finished: Boolean,
    report: String,
    visualized: Boolean,
    visualizedDate: Date,
    checkIn: Boolean,
    checkInDate: Date,
    checkOut: Boolean,
    checkOutDate: Date,
    checkinManual: Boolean,
    signatureBase64: String,
    attachmentsBase64: Array,
    checkList: Array

});

module.exports = mongoose.model('Produto', ProdutoSchema);