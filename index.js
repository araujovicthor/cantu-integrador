/*

    Quotation API by Erlan Cassiano, Victor Araújo and Mateus Luiz

    Recieve a request with:
        - Content-Type: application/json
        - Body:
            {
              "data": {
                "orderIdentifier": "_95dumy8an",
                "equipmentId": 100,
                "latitude": -15.8218562,
                "longitude": -47.9038911,
                "deliveryDate": "2018-03-08T10:00:00",
                "retrieveDate": "2018-03-19T10:00:00",
                "quantity": 1,
                "user_id": "anonymous"
              }
            }
 */

let router = require('http-routing');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');

const quotate = require('./app/resources/quotate');
const getOrder = require('./app/resources/get_order');
const calculatePrice = require('./app/resources/calculate_price');

exports.handler = (event, context, callback) => {
  let routes = [];
  routes.push(router.route('GET', '/v1/quotation', quotate));
  routes.push(router.route('GET',  '/v1/quotation/:uuid', getOrder));
  routes.push(router.route('GET',  '/v1/finalprice', calculatePrice));
  let action = router.match(routes, event.httpMethod, event.path);

  if (action == null)
    return callback(null, {statusCode: 404});

  let promise = action.value(event);
  promise
    .then((data) => {
      callback(null, {
        statusCode: 200,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: data})
      });
    })
    .catch((err) => {
      let errorMessage = err.message || err;
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({error: errorMessage })
      });
    });
};
