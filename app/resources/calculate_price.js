const _ = require('lodash');
const PriceHandler = require('../handlers/price_handler');
const { $ } = require('moneysafe');

module.exports = (event) => {
  let averagePrice = _(event).get('queryStringParameters.averagePrice');
  return new Promise((resolve, reject) => {
    if(averagePrice) return resolve(new PriceHandler().calculateFinalAveragePrice($.of(averagePrice)));
    reject('Preço médio não informado no paretro average');
  });
};
