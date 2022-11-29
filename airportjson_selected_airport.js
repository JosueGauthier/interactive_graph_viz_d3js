const csvAirport = require('csvtojson');
const csvFlight = require('csvtojson');

var fs = require('fs');

const csvAirportPath = 'airport_codes.csv';
const csvFlightPath = 'flight.csv';


var dataAirport = [];

var dataFlightGlobal;
csvFlight()
    .fromFile(csvFlightPath)
    .then(function (jsonArrayObjFlight) { //when parse finished, result will be emitted here.
        console.log(jsonArrayObjFlight);
        dataFlightGlobal = jsonArrayObjFlight;
    })



csvAirport()
    .fromFile(csvAirportPath)
    .then(function (jsonArrayObjAirport) { //when parse finished, result will be emitted here.
        formatDataAirport(jsonArrayObjAirport);
    })


function formatDataAirport(data) {

    var formatted = [];
    console.log(dataFlightGlobal);
    data.forEach(function (r) {

        if (r.iata && r.name && r.city && r.state && r.country && r.latitude && r.longitude) {

            var airportIndex = dataFlightGlobal.findIndex(x => x.origin == r.iata);
            //console.log(airportIndex);

            if (airportIndex !== -1) {
                formatted.push({
                    iata: r.iata,
                    nameAirport: r.name,
                    city: r.city,
                    state: r.state,
                    country: r.country,
                    latitude: parseInt(r.latitude),
                    longitude: parseInt(r.longitude)
                });
            }

        }
    });
    var json = JSON.stringify(formatted);
    fs.writeFile("airport_codes_simplified.json", JSON.stringify(formatted), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );
}