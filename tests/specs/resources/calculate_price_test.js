const calculatePrice =  require('../../../app/resources/calculate_price.js');

describe('calculatePrice', () => {
  it('return correct price', (done) => {
    calculatePrice({
      queryStringParameters: { averagePrice: 20000 }
    }).then((data) => {
      expect(data).toEqual({
        "ownerPrice": 20000,
        "full": 22520,
        "max": 24718,
        "min": 18114
      });
      done();
    });
  });

  it('return error for empty average price', (done) => {
    calculatePrice().catch((err) => {
      expect(err).toEqual('Preço médio não informado no paretro average');
      done();
    });
  });
});
