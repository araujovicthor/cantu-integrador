require('../../mocks/quotate_mocks')();
const quotate = require('../../../app/resources/quotate');

const validBody = {
  'equipmentId':     100,
  'latitude':        -15.8218562,
  'longitude':       -47.9038911,
  'deliveryDate':    '2018-03-08T10:00:00',
  'retrieveDate':    '2018-03-19T10:00:00',
  'quantity':        1,
  'orderIdentifier': "_95dumy8an"
};

const invalidBody = {
  'equipmentId': null,
  'latitude': null,
  'longitude': null,
  'deliveryDate': null,
  'retrieveDate': null
};

describe('quotate', () => {
  it('Calculate price for valid order' , (done) => {
    jest.setTimeout(30000);
    quotate({
      queryStringParameters: validBody,
      httpMethod:            'POST',
      path:                  '/quotation'
    }).then((data) => {
      expect(data).toEqual({
        uuid: "adc82b20-4e10-11e8-a319-852c644aa122",
        equipmentId: 100,
        garagesConsulted: 1,
        prices: {
          max: 12128,
          min: 8911
        }
      });
      done();
    });
  });
});
