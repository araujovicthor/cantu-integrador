process.env.AWS_SECRET_ACCESS_KEY = "stub-key";
process.env.AWS_ACCESS_KEY_ID = "stub-id";
process.env.DYNAMODB_ENDPOINT = "http://localhost:8000";
process.env.ORDER_INFO_TABLE = "OrderInfoTest";
const MockDate = require('mockdate');
MockDate.set("2018-01-01");

jest.mock('../../../db/connection', () => {
    return {
        query: (params, callback) => {
            callback(null, {
                Items: [{
                    "orderIdentifier": "_95dumy8an",
                    "latitude": -15.8218562,
                    "retrieveDate": "2018-03-19",
                    "deliveryDate": "2018-03-08",
                    "quantity": 1,
                    "prices": {
                        "owner": 12150,
                        "full": 13842
                    },
                    "uuid": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                    "equipmentId": 1,
                    "longitude": -47.9038911,
                    "garagesEquipmentAvailable": [
                        {
                            "id": 0,
                            "fullPrice": 12150,
                            "rentPrice": 9000,
                            "shippingPrice": 3150
                        }
                    ],
                    "createdAt": 1514764800000
                }]
            });
        }
    }
});

jest.mock('../../../app/handlers/date_handler');
jest.mock('uuid/v1');

const connection = require('../../../db/connection');
const DateHandler = require('../../../app/handlers/date_handler');
const OrderModel = require('../../../app/models/order_model');
const uuidV1 = require('uuid/v1');

it('Order has the correct params', () => {
  uuidV1.mockImplementation(() => "1cca7050-375f-11e8-85c0-65fd1175fcc7");
  let params = {
    uuid:             "1cca7050-375f-11e8-85c0-65fd1175fcc7",
    orderIdentifier:  "_95dumy8an",
    equipmentId:      100,
    latitude:         -15.8068155,
    longitude:        -47.9357351,
    deliveryDate:     '2018-03-08',
    retrieveDate:     '2018-03-19',
    prices:           [],
    garagesEquipmentAvailable: [],
    createdAt:        1514764800000,
    quantity:         1,
    user_id:          'anonymous',
    saleSuccess:      0
  };

  let order = new OrderModel(params);
  expect(Object.values(order)).toEqual(Object.values(params));
});

describe('saveOrderInfo', () => {
    it('Save an order sucessfully', () => {
        const order = {
            latitude: -15.8218562,
            longitude: -47.9038911,
            deliveryDate: '2018-03-08T10:00:00',
            retrieveDate: '2018-03-19T10:00:00',
            equipmentId: 1,
            prices: {
                owner: 12150,
                full: 13842
            },
            garagesEquipmentAvailable: [{
                id:               0,
                fullPrice:        12150,
                rentPrice:        9000,
                shippingPrice:    3150,
                garageDistanceKm: 8.552
            }]
        };
        const put = jest.fn();
        connection.put = put;
        OrderModel.saveOrderInfo(order);
        expect(put).toHaveBeenCalledWith({
            TableName: "OrderInfoTest",
            Item: order
        }, expect.any(Function));
    });
});

describe('findOrder', () => {
    it('find order info previosly calculated', (done) => {
        OrderModel.findOrder("6c84fb90-12c4-11e1-840d-7b25c5ee775a")
          .then((orders) => {
            expect(orders).toEqual([{
                "orderIdentifier": "_95dumy8an",
                "latitude": -15.8218562,
                "retrieveDate": "2018-03-19",
                "deliveryDate": "2018-03-08",
                "quantity": 1,
                "prices": {
                    "owner": 12150,
                    "full": 13842
                },
                "uuid": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "equipmentId": 1,
                "longitude": -47.9038911,
                "garagesEquipmentAvailable": [
                    {
                        "id": 0,
                        "fullPrice": 12150,
                        "rentPrice": 9000,
                        "shippingPrice": 3150
                    }
                ],
                "createdAt": 1514764800000
            }]);
            done();
        });

    });
});

describe('isValid', () => {
   it('return true for valid order', () => {
       DateHandler.mockImplementation(() => ({
           isValid: () => (true)
       }));

       let params = {
           equipmentId: 100,
           latitude: -15.8068155,
           longitude: -47.9357351,
           deliveryDate: '2018-03-08T10:00:00',
           retrieveDate: '2018-03-19T10:00:00',
           quantity: 1,
           orderIdentifier: "_95dumy8an"
       };

       let order = new OrderModel(params);
       expect(order.isValid()).toBeTruthy();
   });

    it('return false for invalid order', () => {
        let params = {
            equipmentId: null,
            latitude: null,
            longitude: null,
            deliveryDate: null,
            retrieveDate: null
        };

        let order = new OrderModel(params);
        expect(order.isValid()).toBeFalsy();
    });

    it('has errors for invalid order', () => {
        let params = {
            equipmentId: null,
            latitude: null,
            longitude: null,
            deliveryDate: null,
            retrieveDate: null
        };

        let order = new OrderModel(params);
        order.isValid();
        expect(order.error).toEqual('O pedido não possuí os seguintes atributos: equipmentId, latitude, longitude, deliveryDate, retrieveDate');
    });

    it('validate dates', () => {
        let params = {
            equipmentId: 100,
            latitude: -15.8068155,
            longitude: -47.9357351,
            deliveryDate: '2018-03-08T10:00:00',
            retrieveDate: '2018-03-19T10:00:00',
            quantity: 1,
            orderIdentifier: "_95dumy8an"
        };

        let mockedValidationMethod = jest.fn();

        DateHandler.mockImplementation(() => ({
            isValid: mockedValidationMethod
        }));

        let order = new OrderModel(params);
        order.isValid();
        expect(mockedValidationMethod).toBeCalled();
    });
});
