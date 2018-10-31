require('dotenv').config();
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

class DistanceHandler {
  constructor(order, garages) {
    this.order = order;
    this.garages = garages;
  }

  lineDistance() {
    let raio = 6371000; //diametro da terra em metros
    let teta1 = this.order.latitude * (Math.PI / 180);
    let teta2 = [];
    let deltaTeta = [];
    let deltaLambda = [];
    let a = [];
    let c = [];
    let dist = [];

    let distKm = [];

    for (let i = 0; i < this.garages.length; i++) {
      teta2[i] = this.garages[i].latitude * (Math.PI / 180);

      deltaTeta[i] = (this.garages[i].latitude - this.order.latitude) * (Math.PI / 180);
      deltaLambda[i] = (this.garages[i].longitude - this.order.longitude) * (Math.PI / 180);

      a[i] = (Math.sin(deltaTeta[i] / 2) * Math.sin(deltaTeta[i] / 2)) +
        (Math.cos(teta1) * Math.cos(teta2[i]) * Math.sin(deltaLambda[i] / 2) *
          Math.sin(deltaLambda[i] / 2));
      c[i] = 2 * Math.atan2(Math.sqrt(a[i]), Math.sqrt(1 - a[i]));

      dist[i] = raio * c[i]; // metros
      distKm.push([
        (dist[i] / 1000),
        this.garages[i].id,
        this.garages[i].latitude,
        this.garages[i].longitude,
        this.garages[i].radius,
        this.garages[i].rentPricePolicy,
        this.garages[i].shippingPricePolicy,
        this.garages[i].equipmentId
      ]);
    }

    distKm.sort(function (a, b) { // organizando do menor até o maior com a primeira coluna
      return a[0] - b[0];
    });

    let select = distKm.length;
    let kRaio = 0;
    for (let i = 0; i < select; i++) {
      if (distKm[i][0] <= distKm[i][4]) {
        kRaio = kRaio + 1;
      }
    }
    let distRadius = new Array(kRaio); // array 2D
    for (let j = 0; j < kRaio; j++) {
      distRadius[j] = new Array(4);
    }

    let xyz = 0;
    for (let i = 0; i < select; i++) {
      if (distKm[i][0] <= distKm[i][4]) {
        distRadius[xyz][0] = distKm[i][0];
        distRadius[xyz][1] = distKm[i][1];
        distRadius[xyz][2] = distKm[i][2];
        distRadius[xyz][3] = distKm[i][3];
        distRadius[xyz][4] = distKm[i][4];
        distRadius[xyz][5] = distKm[i][5];
        distRadius[xyz][6] = distKm[i][6];
        distRadius[xyz][7] = distKm[i][7];
        xyz = xyz + 1;
      }
    }

    let kBest = distRadius.length;


    if (kBest === 0) {
      throw new Error('Não há garagem cadastrada com o equipamento solicitado que atenda esta região.');
    } else {
      let result = [];

      for (let k = 0; k < kBest; k++) {
        result.push({
          id: distRadius[k][1],
          distance: distRadius[k][0],
          latitude: distRadius[k][2],
          longitude: distRadius[k][3],
          radius: distRadius[k][4],
          rentPricePolicy: distRadius[k][5],
          shippingPricePolicy: distRadius[k][6],
          equipmentId: distRadius[k][7],
        });
      }

      return result;
    }
  }

  mapsDistance(filteredGarages) {
    let destinations = filteredGarages.map(g => `${g.latitude}, ${g.longitude}`);

    return new Promise((resolve, reject) => {
      googleMapsClient.distanceMatrix({
        origins: [`${this.order.latitude}, ${this.order.longitude}`],
        destinations: destinations,
        mode: 'driving',
        units: 'metric'
      }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          let result = this.createMapsObjects(filteredGarages, response.json.rows[0].elements);
          resolve(result);
        }
      });
    });
  }

  createMapsObjects(filteredGarages, elements) {
    let result = [];
    for (let i = 0; i < elements.length; i++) {
      result.push({
        id: filteredGarages[i].id,
        latitude: filteredGarages[i].latitude,
        longitude: filteredGarages[i].longitude,
        radius: filteredGarages[i].radius,
        rentPricePolicy: filteredGarages[i].rentPricePolicy,
        shippingPricePolicy: filteredGarages[i].shippingPricePolicy,
        equipmentId: filteredGarages[i].equipmentId,
        distance: (elements[i].distance.value / 1000)
      });
    }
    return result;
  }
}

module.exports = DistanceHandler;
