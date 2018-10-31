const moment = require('moment');
const DateHolidays = require('date-holidays');
const holidays = new DateHolidays();

class DateHandler {
  constructor(deliveryDate, retrieveDate, coutry) {
    if (!coutry)
      coutry = 'BR';
    holidays.init(coutry);
    this.momentDeliveryDate = moment(deliveryDate).toDate();
    this.momentRetrieveDate = moment(retrieveDate).toDate();
    this.error = {};

    this.isWeekend = () => {
      if (this.momentDeliveryDate.getDay() === 0 || this.momentDeliveryDate.getDay() === 6 ||
                this.momentRetrieveDate.getDay() === 6 || this.momentRetrieveDate.getDay() === 6) {
        this.error = 'Não é possível entregar ou retirar no final de semana';
        return true;
      }
    };

    this.isHoliday = () => {
      if (holidays.isHoliday(this.momentDeliveryDate) ||
                holidays.isHoliday(this.momentRetrieveDate)) {
        this.error = 'Não é possível entregar ou retirar em feriados';
        return true;
      }
    };

    this.isRetrieveAfterDelivery = () => {
      if (moment(this.momentRetrieveDate).isBefore(this.momentDeliveryDate)) {
        this.error = 'Data de devolução é menor ou igual a data de entrega';
        return false;
      }
      return true;
    };

    this.isDeliveryDateAfterToday = () => {
      if (moment(this.momentDeliveryDate).valueOf() < moment(new Date()).valueOf()) {
        this.error = 'Não é possível entregar antes da data atual';
        return false;
      }
      return true;
    };

    this.isDateFormatValid = () => {
      if (!moment(deliveryDate).isValid() || !moment(retrieveDate).isValid()) {
        this.error = 'Formato de data inválido';
        return false;
      }
      return true;
    };
  }

  isValid() {
    return (
      this.isDeliveryDateAfterToday() &&
            this.isDateFormatValid() &&
            !(this.isWeekend()) &&
            !(this.isHoliday()) &&
            this.isRetrieveAfterDelivery()
    );
  }

  workingDaysQuantity() {
    let diff = moment(this.momentRetrieveDate).diff(this.momentDeliveryDate, 'days');
    if (diff <= 7) {
      for (let i = moment(this.momentDeliveryDate); i.isBefore(this.momentRetrieveDate); i.add(1, 'days')) {
        if (holidays.isHoliday(i.toDate()) || i.day() === 0 || i.day() === 0)
          diff--;
      }
    }
    return diff;
  }
}

module.exports = DateHandler;
