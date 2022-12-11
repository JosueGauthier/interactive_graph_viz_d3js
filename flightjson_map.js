var airport_codes_simplifiedJSON = require('./airport_codes_simplified.json')

const csv = require('csvtojson');

var fs = require('fs');

const csvFilePath = 'flight.csv';

var data = [];

csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) { //when parse finished, result will be emitted here.
        formatData(jsonArrayObj);
    })

function formatData(data) {
    var formatted = {
        nodes: [],
        links: []
    };

    compteur = 1

    data.forEach(function (r) {
        //check for your empty or 'None' fields here
        if (r.origin && r.destination && r.count) {
            var indexOrigin = formatted.nodes.findIndex(x => x.id == r.origin);
            var indexDestination = formatted.nodes.findIndex(x => x.id == r.destination);
            var airportIndexOrigin = airport_codes_simplifiedJSON.findIndex(x => x.iata == r.origin);
            var airportIndexDestination = airport_codes_simplifiedJSON.findIndex(x => x.iata == r.destination);

            if (indexOrigin === -1) {
                formatted.nodes.push({
                    id: r.origin,
                    group: compteur,
                    totalFlight: r.count,
                    nameAirport: airport_codes_simplifiedJSON[airportIndexOrigin].nameAirport,
                    city: airport_codes_simplifiedJSON[airportIndexOrigin].city,
                    state: airport_codes_simplifiedJSON[airportIndexOrigin].state,
                    country: airport_codes_simplifiedJSON[airportIndexOrigin].country,
                    latitude: airport_codes_simplifiedJSON[airportIndexOrigin].latitude,
                    longitude: airport_codes_simplifiedJSON[airportIndexOrigin].longitude,
                });
                compteur++;

            } else {
                formatted.nodes[indexOrigin].totalFlight = parseInt(formatted.nodes[indexOrigin].totalFlight) + parseInt(r.count)
            }
            if (indexDestination === -1) {
                formatted.nodes.push({
                    id: r.destination,
                    group: compteur,
                    totalFlight: r.count,

                    nameAirport: airport_codes_simplifiedJSON[airportIndexDestination].nameAirport,
                    city: airport_codes_simplifiedJSON[airportIndexDestination].city,
                    state: airport_codes_simplifiedJSON[airportIndexDestination].state,
                    country: airport_codes_simplifiedJSON[airportIndexDestination].country,
                    latitude: airport_codes_simplifiedJSON[airportIndexDestination].latitude,
                    longitude: airport_codes_simplifiedJSON[airportIndexDestination].longitude,
                });
                compteur++;
            }
            else {
                formatted.nodes[indexDestination].totalFlight = parseInt(formatted.nodes[indexDestination].totalFlight) + parseInt(r.count)
            }
        }

        if (r.origin && r.destination && r.count) {

            var airportIndexOrigin = airport_codes_simplifiedJSON.findIndex(x => x.iata == r.origin);
            var airportIndexDestination = airport_codes_simplifiedJSON.findIndex(x => x.iata == r.destination);

            var indexOriginLinks = formatted.links.findIndex((x) => {
                return (x.source == r.origin && x.target == r.destination) || (x.target == r.origin && x.source == r.destination)
            });

            if (indexOriginLinks === -1) {
                formatted.links.push({ 
                    source: r.origin,
                    sourceLatitude: airport_codes_simplifiedJSON[airportIndexOrigin].latitude,
                    sourceLongitude: airport_codes_simplifiedJSON[airportIndexOrigin].longitude, 

                    target: r.destination, 
                    targetLatitude: airport_codes_simplifiedJSON[airportIndexDestination].latitude,
                    targetLongitude: airport_codes_simplifiedJSON[airportIndexDestination].longitude,
                    
                    totalFlightBeetween: r.count, 
                    departure: parseInt(r.count), 
                    arrival: 0,           
                });
            } else {
                formatted.links[indexOriginLinks].totalFlightBeetween = parseInt(formatted.links[indexOriginLinks].totalFlightBeetween) + parseInt(r.count)
                formatted.links[indexOriginLinks].arrival = parseInt(r.count)
            }
        }
    });

    //do something with the finished product
    var json = JSON.stringify(formatted);
    fs.writeFile("flight_and_airport.json", JSON.stringify(formatted), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );

}