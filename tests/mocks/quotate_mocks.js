process.env.AWS_SECRET_ACCESS_KEY = "stub-key";
process.env.AWS_ACCESS_KEY_ID = "stub-id";

jest.mock('../../app/handlers/distance_handler');
jest.mock('../../app/handlers/date_handler');
// jest.mock('../../app/models/order_model');
jest.mock('uuid/v1', () => {
  return () => "adc82b20-4e10-11e8-a319-852c644aa122"
});
jest.mock('../../db/connection', () => {
    return {
        put: () => {},
        scan: (params, callback) => {
            callback(null, {
                Items: [
                    {
                        equipment_id: 100,
                        id: 0,
                        latitude: -15.8068155,
                        longitude: -47.9357351,
                        radius: 100,
                        rent_price_policy: [
                            {
                                days: 5,
                                price: 1000
                            }
                        ],
                        shipping_price_policy: [
                            {
                                km: 10,
                                price: 50
                            }
                        ]
                    }
                ]
            });
        }
    }
});

const DistanceHandler = require('../../app/handlers/distance_handler');
const DateHandler = require('../../app/handlers/date_handler');
const OrderModel = require('../../app/models/order_model');

function mockDependencies() {
    DistanceHandler.mockImplementation(() => ({
        lineDistance: () => {
            return [{
                id: 0,
                distance: 3.795238654650343,
                latitude: -15.8068155,
                longitude: -47.9357351
            }]
        },
        mapsDistance: () => {
            return new Promise((resolve, reject) => {
                resolve([{
                    id: 0,
                    distance: 6.3,
                    latitude: -15.8068155,
                    longitude: -47.9357351,
                    radius: 100,
                    rentPricePolicy: [
                        {
                            days: 5,
                            price: 1000
                        }
                    ],
                    shippingPricePolicy: [
                        {
                            km: 10,
                            price: 50
                        }
                    ]
                }])
            });
        }
    }));

    DateHandler.mockImplementation(() => ({
        validate: () => (true),
        workingDaysQuantity: () => (9),
        isValid: () => (true)
    }));

    OrderModel.saveOrderInfo = () => {};

    // OrderModel.mockImplementation(() => {
    //     return {
    //       uuid: "1cca7050-375f-11e8-85c0-65fd1175fcc7",
    //       equipmentId: 100,
    //       isValid: () => (true)
    //     };
    // });
}

module.exports = mockDependencies;
