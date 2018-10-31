process.env.AWS_SECRET_ACCESS_KEY = "stub-key";
process.env.AWS_ACCESS_KEY_ID = "stub-id";

require('../mocks/quotate_mocks')();
const OrderModel = require('../../app/models/order_model');

const validBody = {
  'equipmentId': 100,
  'latitude': -15.8218562,
  'longitude': -47.9038911,
  'deliveryDate': '2018-03-08T10:00:00',
  'retrieveDate': '2018-03-19T10:00:00'
};

const invalidBody = {
  'equipmentId': null,
  'latitude': null,
  'longitude': null,
  'deliveryDate': null,
  'retrieveDate': null
};

const index = require('../../index');

describe('GET /quotation/{uuid}', () => {
  let quotationInfo = {
    "latitude": -15.8218562,
    "retrieveDate": "2018-03-19",
    "deliveryDate": "2018-03-08",
    "quantity": 1,
    "prices": {
      "owner": 12150,
      "full": 13842,
      "min": 11073,
      "max": 15226
    },
    "uuid": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    "equipmentId": 100,
    "longitude": -47.9038911,
    "garagesEquipmentAvailable": [
      {
        "id":               1,
        "fullPrice":        12150,
        "rentPrice":        9000,
        "shippingPrice":    3150,
        "garageDistanceKm": 5.0
      }
    ],
    "createdAt": 1514764800000
  }

  beforeEach(() => { // mock
    OrderModel.findOrder = () => {
      return new Promise((resolve, reject) => {
        resolve([quotationInfo]);
      })
    }
  });

  it('should return 200', (done) => {
    const awsCallback = jest.fn((error, data) => {
      expect(data.statusCode).toEqual(200);
      done();
    });
    index.handler({
      httpMethod: 'GET',
      path: '/v1/quotation/6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      pathParameters: {
        uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
      }
    }, null, awsCallback);
  });

  it('Pass complete information to the callback', (done) => {
    const awsCallback = jest.fn((err, data) => {
      expect(awsCallback).toHaveBeenCalledWith(null, {
        "body": JSON.stringify({data: quotationInfo}),
        "headers": {"Content-Type": "application/json"},
        "statusCode": 200
      });
      done();
    });
    index.handler({
      httpMethod: 'GET',
      path: '/v1/quotation/6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      pathParameters: {
        uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
      },
      queryStringParameters: {
        type: 'complete'
      }
    }, null, awsCallback);
  });

  it('Pass simple information to the callback', (done) => {
    let simpleBody = {
      data: {
        uuid:             quotationInfo.uuid,
        equipmentId:      quotationInfo.equipmentId,
        garagesConsulted: quotationInfo.garagesEquipmentAvailable.length,
        prices: {
          min: quotationInfo.prices.min,
          max: quotationInfo.prices.max
        }
      }
    };

    const awsCallback = jest.fn((err, data) => {
      expect(awsCallback).toHaveBeenCalledWith(null, {
        "body": JSON.stringify(simpleBody),
        "headers": {"Content-Type": "application/json"},
        "statusCode": 200
      });
      done();
    });
    index.handler({
      httpMethod: 'GET',
      path: '/v1/quotation/6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      pathParameters: {
        uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
      },
      queryStringParameters: {
        type: 'simple'
      }
    }, null, awsCallback);
  });
});

describe('GET /quotation?params', () => {
  it('should return corret response', (done) => {
    const awsCallback = jest.fn((err, data) => {
      expect(awsCallback).toHaveBeenCalledWith(null, {
        "headers": {"Content-Type" : "application/json"},
        "statusCode": 200,
        "body": JSON.stringify({
          data: {
            uuid: "adc82b20-4e10-11e8-a319-852c644aa122",
            equipmentId: 100,
            garagesConsulted: 1,
            prices: {
              min: 8911,
              max: 12128
            }
          }
        })
      });
      done();
    });

    index.handler({
      httpMethod: 'GET',
      path: `/v1/quotation?equipmentId=${validBody.equipmentId} \
              &deliveryDate=${validBody.deliveryDate} \
              &retrieveDate=${validBody.retrieveDate} \
              &latitude=${validBody.latitude} \
              &longitude=${validBody.longitude}`,
      queryStringParameters: {
        equipmentId: validBody.equipmentId,
        deliveryDate: validBody.deliveryDate,
        retrieveDate: validBody.retrieveDate,
        latitude: validBody.latitude,
        longitude: validBody.longitude
      }
    }, null, awsCallback);
  });
});

describe('GET /finalprice?averagePrice=<price>', () => {
  it('should respond correct body', (done) => {
    let averagePrice = "115000";
    let expectedBody = {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        data: {
          ownerPrice: 115000,
          full: 125549,
          min: 100746,
          max: 137929
        }
      })
    };

    const awsCallback = jest.fn((err, data) => {
      expect(awsCallback).toHaveBeenCalledWith(null, expectedBody);
      done();
    });

    index.handler({
      httpMethod: 'GET',
      path: `/v1/finalprice?averagePrice=${averagePrice}`,
      queryStringParameters: {
        averagePrice: averagePrice
      }
    }, null, awsCallback);
  })
});
