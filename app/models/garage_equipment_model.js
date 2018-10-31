const connection = require('../../db/connection');

class GarageEquipmentModel {
  constructor(garageEquipmentParams) {
    this.id = garageEquipmentParams.id;
    this.latitude = garageEquipmentParams.latitude;
    this.longitude = garageEquipmentParams.longitude;
    this.equipmentId = garageEquipmentParams.equipmentId;
    this.radius = garageEquipmentParams.radius;
    this.rentPricePolicy = garageEquipmentParams.rentPricePolicy;
    this.shippingPricePolicy = garageEquipmentParams.shippingPricePolicy;
  }

  static findGaragesByEquipment(equipmentId) {
    let params = {
      TableName: process.env.GARAGE_TABLE,
      FilterExpression: 'equipmentId = :equipmentId',
      ExpressionAttributeValues: {':equipmentId': Number(equipmentId)}
    };

    return new Promise((resolve, reject) => {
      connection.scan(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items);
        }
      });
    });
  }
}

module.exports = GarageEquipmentModel;
