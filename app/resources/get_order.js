const OrderModel = require('../models/order_model');
const ResponseHelpers = require('../helpers/response_helpers');
const _ = require('lodash');

module.exports = (event) => {
  let uuid = event.pathParameters.uuid;
  let type = _(event.queryStringParameters).get('type', 'complete');
  return new Promise((resolve, reject) => {
    OrderModel.findOrder(uuid).then((data) => {
      if (data.length !== 0) {
        switch (type) {
        case 'complete' || '':
          return resolve(data[0]);
        case 'simple':
          return resolve(ResponseHelpers.formatSimpleResponseBody(data[0], data[0].prices));
        default:
          reject('Tipo inválido');
        }
      } else {
        reject('O uuid não foi encontrado');
      }
    }).catch((err) => {
      reject(err);
    });
  });
};
