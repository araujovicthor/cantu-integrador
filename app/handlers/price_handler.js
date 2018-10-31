const { $ } = require('moneysafe');

class PriceHandler {
  calculatePrice(garagesDistanceInfo, days, quantity = 1) {
    let garages = [];
    let valorMedia = 0;
    garagesDistanceInfo.forEach((garageInfo) => {
      let rentPrice = $.of(quantity * days * this.interpolate(days, garageInfo.rentPricePolicy));
      let shippingPrice = $.of(quantity * 2 * (garageInfo.distance * this.interpolate(garageInfo.distance, garageInfo.shippingPricePolicy)));
      shippingPrice = shippingPrice < 0 ? 0 : shippingPrice;

      let fullPrice = rentPrice.add(shippingPrice);

      garages.push({
        garageEquipmentId: garageInfo.id,
        rentPrice:         rentPrice.cents,
        shippingPrice:     shippingPrice.cents,
        fullPrice:         fullPrice.cents,
        garageDistanceKm:  Number(garageInfo.distance.toFixed(3))
      });

      valorMedia += fullPrice.cents;
    });

    valorMedia = $.of(valorMedia / garagesDistanceInfo.length).cents;

    return {
      average: valorMedia,
      garagesPrices: garages
    };
  }


  formatMeasures(policyPrices) {
    return policyPrices.map((policy) => ({
      measure_value: (policy['km'] || policy['days']),
      price:   policy.price
    }));
  }

  interpolate(measureRequired, policyPrices) {
    let sortedParams = this.formatMeasures(policyPrices).sort(function (a, b) {
      return a.measure_value - b.measure_value;
    });
    let arrayLength = sortedParams.length - 1;


    if(measureRequired < sortedParams[0].measure_value)
      return sortedParams[0].price;

    if(measureRequired > sortedParams[arrayLength].measure_value)
      return sortedParams[arrayLength].price;

    let i = 0;
    let measureRequiredPrice = 0;
    while (i <= arrayLength && measureRequired >= sortedParams[i].measure_value) {
      if (measureRequired === sortedParams[i].measure_value) {
        measureRequiredPrice = sortedParams[i].price;
      } else {
        let pointA = [sortedParams[i].measure_value, sortedParams[i].price];
        let pointB = [sortedParams[i + 1].measure_value, sortedParams[i + 1].price];
        let x0 = pointA[0];
        let y0 = pointA[1];
        let x1 = pointB[0];
        let y1 = pointB[1];
        measureRequiredPrice = y0 + (y1 - y0) * ((measureRequired - x0) / (x1 - x0));
      }
      i++;
    }
    return measureRequiredPrice;
  }

  civFee(centsPrice) {
    let percentage = (0.245 * Math.pow((centsPrice/100), -0.235)).toFixed(4);
    return Number(percentage);
  }

  iteratePrice(ownerFee) {
    const FIX_MOIP_PRICE = 69; // cents
    const VARIABLE_MOIP_TAX = 0.0299;
    const TAX_RATE = 0.0925;

    let fullSalePrice = ownerFee;
    let previousPrice = 0;
    let tax = 0;
    let civPrice = 0;
    let moipPrice = 0;
    let diff = 1.00;

    while(diff > 0.0001) {
      previousPrice = fullSalePrice;
      tax = (fullSalePrice - ownerFee) * TAX_RATE;
      civPrice = fullSalePrice * this.civFee(fullSalePrice);
      moipPrice = (FIX_MOIP_PRICE + (fullSalePrice * VARIABLE_MOIP_TAX));
      fullSalePrice = Math.round(ownerFee + moipPrice + tax + civPrice);
      diff = Math.abs(fullSalePrice - previousPrice);
    }
    return fullSalePrice;
  }

  calculateFinalAveragePrice(average) {
    const ownerFee = average.cents;
    let ownerFeeMin = ownerFee - $(((ownerFee / 100) * 0.2)).cents;
    let ownerFeeMax = ownerFee + $(((ownerFee / 100) * 0.1)).cents;

    ownerFeeMin = this.iteratePrice(ownerFeeMin);
    ownerFeeMax = this.iteratePrice(ownerFeeMax);
    let ownerFeeFullPrice = this.iteratePrice(ownerFee);

    let minPrice = $.of(ownerFeeMin).cents;
    let maxPrice = $.of(ownerFeeMax).cents;
    let salePrice = $.of(ownerFeeFullPrice).cents;

    return {
      ownerPrice: ownerFee,
      full: salePrice,
      min: minPrice,
      max: maxPrice
    };
  }
}

module.exports = PriceHandler;
