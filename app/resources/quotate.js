const OrderModel = require('../models/order_model');
const DateHandler = require('../handlers/date_handler');
const moment = require('moment-timezone');
const GarageEquipmentModel = require('../models/garage_equipment_model');
const PriceHandler = require('../handlers/price_handler');
const DistanceHandler = require('../handlers/distance_handler');
const ResponseHelpers = require('../helpers/response_helpers');
const { $ } = require('moneysafe');

function saveOrder(order, garagesPrices, finalPrice) {
  OrderModel.saveOrderInfo({
    uuid: order.uuid,
    latitude: order.latitude,
    longitude: order.longitude,
    deliveryDate: order.deliveryDate,
    retrieveDate: order.retrieveDate,
    equipmentId: order.equipmentId,
    user_id: order.user_id,
    prices: {
      owner: finalPrice.ownerPrice,
      full: finalPrice.full,
      min: finalPrice.min,
      max: finalPrice.max
    },
    garagesEquipmentAvailable: garagesPrices,
    quantity: order.quantity,
    createdAt: moment(new Date()).valueOf()
  });
}

module.exports = (event) => {
  return new Promise((resolve, reject) => {
    let orderParams = event.queryStringParameters;
    if (orderParams == null || orderParams == {}) return reject('Informação do da requisição vazia');

    const order = new OrderModel(orderParams);
    if (!order.isValid()) return reject(order.error);

    const dateHandler = new DateHandler(order.deliveryDate, order.retrieveDate);

    GarageEquipmentModel.findGaragesByEquipment(order.equipmentId).then((garages) => {
      if (garages.length === 0) return reject('Nenhuma garagem cadastrada');

      const distanceHandler = new DistanceHandler(order, garages);

      let filteredGarages = distanceHandler.lineDistance();
      distanceHandler.mapsDistance(filteredGarages).then((garageRealDistances) => {
        const priceHandler = new PriceHandler();

        let garagePrices = priceHandler.calculatePrice(garageRealDistances, dateHandler.workingDaysQuantity(), order.quantity);
        let finalPrice = priceHandler.calculateFinalAveragePrice($.of(garagePrices.average));

        saveOrder(order, garagePrices.garagesPrices, finalPrice);
        resolve(ResponseHelpers.formatSimpleResponseBody(order, finalPrice, garagePrices));
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
