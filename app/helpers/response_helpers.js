const _ = require('lodash');

class ResponseHelpers {
  static formatSimpleResponseBody(orderInfo, prices, garagePrices = null) {
    return {
      uuid: orderInfo.uuid,
      equipmentId: orderInfo.equipmentId,
      garagesConsulted: _(garagePrices).get('garagesPrices.length', null) || orderInfo.garagesEquipmentAvailable.length,
      prices: {
        min: prices.min,
        max: prices.max
      }
    };
  }
}

module.exports = ResponseHelpers;
