### Changelog

### 0.4.3

* Feature
  * Endpoint "/finalprice?averagePrice=<value>" added to calculate the price with all the taxes, please see the project documentation for more details

* Changes
  * The civ fee it's not fixed anymore, there's an inverse exponential to calculate the fee

### 0.3.2

* Feature
  * The body from the "/quotation/uuid" varies according to the "type" present in the query string, please see the documentation for more details

### 0.2.1 2018/04/10

* Feature
  * "/quotation/uuid" endpoint added, please see the project documentation for more details

* Bug fixes
  * Fixing response attribute name from "full" to "max"

### 0.1.2 2018/04/06

* Change
  * Now all the prices in the API are handled using cents
  * Change the response body, please see the project Wiki

* Bug fixes
  * Fixing bug that not show the fullprice in the response object
  * Fixed the order quantity save in the DynamoDB
