const PriceHandler = require('../../../app/handlers/price_handler');
const priceHandler = new PriceHandler();
const { $ } = require('moneysafe');

const garagesDistanceInfo = [
    {
        id: 2,
        distance: 3.795238654650343,
        latitude: -15.8218562,
        longitude: -47.9038911,
        rentPricePolicy: [
            {
                days: 5,
                price: 2500
            },
            {
                days: 10,
                price: 1000
            },
            {
                days: 20,
                price: 850
            },
        ],
        shippingPricePolicy: [
            {
                km: 10,
                price: 3050
            },
            {
                km: 16,
                price: 2030
            },
            {
                km: 26,
                price: 1035
            },
        ]
    },
    {
        id: 3,
        distance: 8.490896376753833,
        latitude: -15.7631573,
        longitude: -47.8706311,
        rentPricePolicy: [
            {
                days: 10,
                price: 4050
            },
            {
                days: 13,
                price: 3030
            },
            {
                days: 25,
                price: 1500
            },
        ],
        shippingPricePolicy: [
            {
                km: 10,
                price: 3050
            },
            {
                km: 16,
                price: 2030
            }
        ]
    },
    {
        id: 1,
        distance: 9.46944353435194,
        latitude: -15.835983,
        longitude: -48.0188956,
        rentPricePolicy: [
            {
                days: 10,
                price: 4050
            }
        ],
        shippingPricePolicy: [
            {
                km: 10,
                price: 3050
            }
        ]
    }
];

describe('calculatePrice', () => {
    it('recieve correct price object', () => {
        const days = 13;

        const prices = priceHandler.calculatePrice(garagesDistanceInfo, days);

        expect(prices).toEqual({
            average: 79055,
            garagesPrices: [
                {
                    garageEquipmentId: garagesDistanceInfo[0].id,
                    rentPrice:         12415,
                    shippingPrice:     23151,
                    fullPrice:         35566,
                    garageDistanceKm:  3.795
                },
                {
                    garageEquipmentId: garagesDistanceInfo[1].id,
                    rentPrice:         39390,
                    shippingPrice:     51794,
                    fullPrice:         91184,
                    garageDistanceKm:  8.491
                },
                {
                    garageEquipmentId: garagesDistanceInfo[2].id,
                    rentPrice:         52650,
                    shippingPrice:     57764,
                    fullPrice:         110414,
                    garageDistanceKm:  9.469
                }
            ]
        });
    });

    it('Multiply the rent price by the quantity', () => {
      const days = 13;

      const prices = priceHandler.calculatePrice(garagesDistanceInfo, days, 2)

      expect(prices).toEqual({
          average: 158109,
          garagesPrices: [
              {
                  garageEquipmentId: garagesDistanceInfo[0].id,
                  rentPrice:         24830,
                  shippingPrice:     46302,
                  fullPrice:         71132,
                  garageDistanceKm:  3.795
              },
              {
                  garageEquipmentId: garagesDistanceInfo[1].id,
                  rentPrice:         78780,
                  shippingPrice:     103589,
                  fullPrice:         182369,
                  garageDistanceKm:  8.491
              },
              {
                  garageEquipmentId: garagesDistanceInfo[2].id,
                  rentPrice:         105300,
                  shippingPrice:     115527,
                  fullPrice:         220827,
                  garageDistanceKm:  9.469
              }
          ]
      });
    })
});

describe('interpolate', () => {
    it('calculete price policy correcly for 13 days', () => {
        const pricePolicy = garagesDistanceInfo[0].rentPricePolicy;

        const days = 13;
        const result = priceHandler.interpolate(days, pricePolicy);
        expect(result).toEqual(955);
    });

    it('calculete price policy correcly for 7 days', () => {
        const pricePolicy = garagesDistanceInfo[1].rentPricePolicy;

        const days = 7;
        const result = priceHandler.interpolate(days, pricePolicy);
        expect(result).toEqual(4050);
    });

    it('calculete price policy correcly for 27.234km', () => {
        const pricePolicy = garagesDistanceInfo[0].shippingPricePolicy;
        const km = 27.234;
        const result = priceHandler.interpolate(km, pricePolicy);
        expect(result).toEqual(1035);
    });
});

describe('calculateFinalPrice', () => {
    it('calculate the correct final price for an avarage', () => {
      let preco = $.of(569363);
      let prices = priceHandler.calculateFinalAveragePrice(preco);
      expect(prices).toEqual({
         ownerPrice: 569363,
         full: 610834,
         max: 671354,
         min: 489667
      });
    }) ;
});

describe('civFee', () => {
  it('calculate the correct percentage for R$ 250,00', () => {
    let civFee = priceHandler.civFee(25000);
    expect(civFee).toEqual(0.0669);
  });

  it('calculate the correct percentage for R$ 4000,00', () => {
    let civFee = priceHandler.civFee(400000);
    expect(civFee).toEqual(0.0349);
  });

  it('calculate the correct percentage for R$ 1024000,00', () => {
    let civFee = priceHandler.civFee(102400000);
    expect(civFee).toEqual(0.0095);
  });
});
