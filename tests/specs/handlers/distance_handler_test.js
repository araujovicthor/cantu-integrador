const mockDistance = jest.fn();

jest.mock('@google/maps', () => ({
  createClient: () => {
    return {
      distanceMatrix: mockDistance
    }
  }
}));

const DistanceHandler = require('../../../app/handlers/distance_handler');

const order = {
  latitude: -15.8068155,
  longitude: -47.9357351
};

const garages = [
  {
    id: 1,
    latitude: -15.835983,
    longitude: -48.0188956,
    radius: 100,
    rentPricePolicy: [{
      days: 1,
      price: 1
    }],
    shippingPricePolicy: [{
      km: 1,
      price: 0.5
    }],
    equipmentId: 1
  },
  {
    id: 2,
    latitude: -15.8218562,
    longitude: -47.9038911,
    radius: 150,
    rentPricePolicy: [{
      days: 1,
      price: 1
    }],
    shippingPricePolicy: [{
      km: 1,
      price: 0.5
    }],
    equipmentId: 1
  },
  {
    id: 3,
    latitude: -15.7631573,
    longitude: -47.8706311,
    radius: 200,
    rentPricePolicy: [{
      days: 1,
      price: 1
    }],
    shippingPricePolicy: [{
      km: 1,
      price: 0.5
    }],
    equipmentId: 1
  },
];

describe('lineDistance', () => {
  it('return the correct lineDistance objects array', () => {
    const expectedResult = [
      {
        id: 2,
        distance: 3.795238654650343,
        latitude: -15.8218562,
        longitude: -47.9038911,
        radius: 150,
        rentPricePolicy: [{
          days: 1,
          price: 1
        }],
        shippingPricePolicy: [{
          km: 1,
          price: 0.5
        }],
        equipmentId: 1
      },
      {
        id: 3,
        distance: 8.490896376753833,
        latitude: -15.7631573,
        longitude: -47.8706311,
        radius: 200,
        rentPricePolicy: [{
          days: 1,
          price: 1
        }],
        shippingPricePolicy: [{
          km: 1,
          price: 0.5
        }],
        equipmentId: 1
      },
      {
        id: 1,
        distance: 9.46944353435194,
        latitude: -15.835983,
        longitude: -48.0188956,
        radius: 100,
        rentPricePolicy: [{
          days: 1,
          price: 1
        }],
        shippingPricePolicy: [{
          km: 1,
          price: 0.5
        }],
        equipmentId: 1
      }
    ];

    const distanceHandler = new DistanceHandler(order, garages);

    expect(distanceHandler.lineDistance()).toEqual(expectedResult);
  });

  it('should return error for lat/lon outside the range of the garages', function () {
    const distanceHandler = new DistanceHandler({
      latitude: 22.396428,
      longitude: 114.109497
    }, garages);

    expect(() => {
      distanceHandler.lineDistance()
    }).toThrowError(Error);
  });
});

describe('mapsDistance', () => {
  it('return the real lineDistance', () => {
    const distanceHandler = new DistanceHandler(order);

    distanceHandler.mapsDistance(garages);
    expect(mockDistance).toBeCalled();
  });
});