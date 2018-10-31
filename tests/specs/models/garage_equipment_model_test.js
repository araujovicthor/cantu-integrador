process.env.AWS_SECRET_ACCESS_KEY = "stub-key";
process.env.AWS_ACCESS_KEY_ID = "stub-id";
process.env.DYNAMODB_ENDPOINT = "http://localhost:8000";

const connection = require('../../../db/connection');
jest.mock('../../../db/connection', () => {
    return {
        scan: (params, callback) => {
            callback(null, {
                Items: [
                    {
                        equipmentId: 1,
                        id: 0,
                        latitude: -15.835983,
                        longitude: -48.0188956,
                        rentPricePolicy: [
                            {
                                days: 5,
                                price: 10
                            }
                        ],
                        shippingPricePolicy: [
                            {
                                km: 10,
                                price: 5
                            }
                        ]
                    }
                ]
            });
        }
    }
});

const GarageEquipmentModel = require('../../../app/models/garage_equipment_model');

it('Order has the correct params', () => {
    let params = {
        id: 1,
        latitude: -15.835983,
        longitude: -48.0188956,
        equipmentId: 100,
        radius: 100,
        rentPricePolicy: [
            {
                days: 5,
                price: 25.00
            }
        ],
        shippingPricePolicy: [
            {
                km: 10,
                price: 30.50
            },
        ]
    };

    let garageEquipment = new GarageEquipmentModel(params);
    expect(Object.values(garageEquipment)).toEqual(Object.values(params));
});

describe('findGaragesByEquipment', () => {
    it('brings the collection of garages with equipment id', (done) => {
        GarageEquipmentModel.findGaragesByEquipment(1).then((garageEquipments) => {
            expect(garageEquipments).toEqual([
                {
                    equipmentId: 1,
                    id: 0,
                    latitude: -15.835983,
                    longitude: -48.0188956,
                    rentPricePolicy: [
                        {
                            days: 5,
                            price: 10
                        }
                    ],
                    shippingPricePolicy: [
                        {
                            km: 10,
                            price: 5
                        }
                    ]
                }
            ]);
            done();
        });
    });
});