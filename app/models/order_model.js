const _ = require('lodash');
const moment = require('moment');
const uuidV1 = require('uuid/v1');
const connection = require('../../db/connection');
const DateHandler = require('../handlers/date_handler');

class OrderService {
  constructor(orderParams) {
    this.uuid = uuidV1();
    this.orderIdentifier = (orderParams.orderIdentifier || '');
    this.equipmentId = orderParams.equipmentId;
    this.latitude = orderParams.latitude;
    this.longitude = orderParams.longitude;
    this.deliveryDate = orderParams.deliveryDate;
    this.retrieveDate = orderParams.retrieveDate;
    this.prices = [];
    this.garagesEquipmentAvailable = [];
    this.createdAt = moment(new Date()).valueOf();
    this.quantity = (orderParams.quantity || 1);
    this.user_id = (orderParams.user_id || 'anonymous');
    this.saleSuccess = 0;
  }

  isValid() {
    let emptyAttributes = _(this).toPairs()
      .filter((pair) => {
        return pair[1] == null;
      })
      .value();
    if (emptyAttributes.length !== 0) {
      let invalidAttributes = emptyAttributes.map((pair) => {
        return pair[0];
      }).join(', ');
      this.error = `O pedido não possuí os seguintes atributos: ${invalidAttributes}`;
      return false;
    }
    let dateHandler = new DateHandler(this.deliveryDate, this.retrieveDate);
    if(!dateHandler.isValid()) {
      this.error = dateHandler.error;
      return false;
    }
    return true;
  }

  static saveOrderInfo(order) {

    let params = {
      TableName: process.env.ORDER_INFO_TABLE,
      Item: order
    };
    connection.put(params, (err) => {
      if (err) throw new Error();
    });
  }

  static findOrder(uuid) {
    let params = {
      TableName: process.env.ORDER_INFO_TABLE,
      KeyConditionExpression: '#uuid = :uuid' ,
      ExpressionAttributeNames: {
        '#uuid': 'uuid'
      },
      ExpressionAttributeValues: {
        ':uuid': uuid
      }
    };

    return new Promise((resolve, reject) => {
      connection.query(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items);
        }
      });
    });
  }
}

module.exports = OrderService;
