/**
 * Arquivo: produto.js
 * Author: Glaucia Lemos
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Produto'
 * Data: 18/10/2017
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    personName: String,
    personPhone: String,
    personEmail: String,
    taskID: Number
});

module.exports = mongoose.model('Person', PersonSchema);