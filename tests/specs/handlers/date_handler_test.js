const DateHandler = require('../../../app/handlers/date_handler');
const moment = require('moment');
const MockDate = require('mockdate');

describe('isValid', () => {
  it('call other methods', function () {
    let validDeliveryDate = '2018-03-08T10:00:00';
    let validRetrieveDate = '2018-03-19T10:00:00';
    const dateHandler = new DateHandler(validDeliveryDate, validRetrieveDate);

    let isWeekend = jest.fn(() => false);
    let isHoliday = jest.fn(() => false);
    let isRetrieveAfterDelivery = jest.fn(() => true);
    let isDateFormatValid = jest.fn(() => true);
    let isDeliveryDateAfterToday = jest.fn(() => true);

    dateHandler.isWeekend = isWeekend;
    dateHandler.isHoliday = isHoliday;
    dateHandler.isRetrieveAfterDelivery = isRetrieveAfterDelivery;
    dateHandler.isDateFormatValid = isDateFormatValid;
    dateHandler.isDeliveryDateAfterToday = isDeliveryDateAfterToday;

    dateHandler.isValid();
    expect(isDeliveryDateAfterToday).toHaveBeenCalled();
    expect(isDateFormatValid).toHaveBeenCalled();
    expect(isWeekend).toHaveBeenCalled();
    expect(isHoliday).toHaveBeenCalled();
    expect(isRetrieveAfterDelivery).toHaveBeenCalled();
  });
});

describe('isWeekend', () => {
  it('Return true for delivery and retrieve dates in weekend', () => {
    let invalidDeliveryDate = '2018-03-10T10:00:00';
    let invalidRetrieveDate = '2018-03-17T10:00:00';
    let validDeliveryDate = '2018-03-08T10:00:00';
    let validRetrieveDate = '2018-03-19T10:00:00';
    expect(new DateHandler(validDeliveryDate, validRetrieveDate).isWeekend()).toBeFalsy();
    expect(new DateHandler(validDeliveryDate, invalidRetrieveDate).isWeekend()).toBeTruthy();
    expect(new DateHandler(invalidDeliveryDate, validRetrieveDate).isWeekend()).toBeTruthy();
  });
});

describe('isHoliday', () => {
  it('Return true for retrieve date in holidays', () => {
    let invalidRetrieveDate = '2018-01-01T10:00:00';
    let validRetrieveDate = '2018-01-02T10:00:00';

    expect(new DateHandler(null, invalidRetrieveDate, "BR").isHoliday()).toBeTruthy();
    expect(new DateHandler(null, validRetrieveDate, "BR").isHoliday()).toBeFalsy();
  });

  it('Return true for delivery date in holidays', () => {
    let invalidDeliveryDate = '2018-01-01T10:00:00';
    let validDeliveryDate = '2018-01-02T10:00:00';

    expect(new DateHandler(invalidDeliveryDate, null, "BR").isHoliday()).toBeTruthy();
    expect(new DateHandler(validDeliveryDate, null, "BR").isHoliday()).toBeFalsy();
  });
});

describe('isRetrieveAfterDelivery', () => {
  it('Return false for retrieve date before the delivery date', () => {
    let deliveryDate = '2018-03-14T10:00:00';
    let invalidRetrieveDate = '2018-03-13T10:00:00';
    let validRetrieveDate = '2018-03-15T10:00:00';

    expect(new DateHandler(deliveryDate, validRetrieveDate).isRetrieveAfterDelivery()).toBeTruthy();
    expect(new DateHandler(deliveryDate, invalidRetrieveDate).isRetrieveAfterDelivery()).toBeFalsy();
  });
});

describe('workingDaysQuantity', () => {
  it("Don't change the diff if the diff is bigger than 7", () => {
    let deliveryDate = '2018-03-01T10:00:00';
    let retrieveDate = '2018-03-10T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).workingDaysQuantity()).toEqual(9);
  });

  it("Return new diff if there's holidays and weekend between the two dates", () => {
    let deliveryDate = '2018-03-26T10:00:00';
    let retrieveDate = '2018-03-31T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).workingDaysQuantity()).toEqual(4);
  });
});

describe('isDateFormatValid', () => {
  it('Is false for invalid deliveryDate date', () => {
    let deliveryDate = '2018-04-31T10:00:00';
    let retrieveDate = '2018-05-01T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDateFormatValid()).toBeFalsy();
  });

  it('Is false for invalid retrieveDate date', () => {
    let deliveryDate = '2018-04-25T10:00:00';
    let retrieveDate = '2018-05-32T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDateFormatValid()).toBeFalsy();
  });

  it('Is true for valid dates', () => {
    let deliveryDate = '2018-04-25T10:00:00';
    let retrieveDate = '2018-05-01T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDateFormatValid()).toBeTruthy();
  });
});

describe('isDeliveryDateAfterToday', () => {
  it('is true for deliveryDate after today', () => {
    MockDate.set('2018-04-24');
    let deliveryDate = '2018-04-25T10:00:00';
    let retrieveDate = '2018-05-01T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDeliveryDateAfterToday()).toBeTruthy();
    MockDate.reset();
  });

  it('is false for deliveryDate before today', () => {
    MockDate.set('2018-04-27');
    let deliveryDate = '2018-04-25T10:00:00';
    let retrieveDate = '2018-05-01T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDeliveryDateAfterToday()).toBeFalsy();
    MockDate.reset();
  });

  it('is possible to choose today with a later hour', () => {
    MockDate.set('2018-04-27T10:00:00');
    let deliveryDate = '2018-04-27T15:00:00';
    let retrieveDate = '2018-05-01T10:00:00';
    expect(new DateHandler(deliveryDate, retrieveDate).isDeliveryDateAfterToday()).toBeTruthy();
    MockDate.reset();
  });
});
