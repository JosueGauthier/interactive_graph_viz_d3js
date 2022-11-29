const csv = require('csvtojson');

var fs = require('fs');

const csvFilePath = 'airport_codes.csv';

var data = [];

console.log(csvFilePath);

csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) { //when parse finished, result will be emitted here.
        formatData(jsonArrayObj);
    })

function formatData(data) {

    var formatted = [];

    data.forEach(function (r) {
        //check for your empty or 'None' fields here
        //iata,name,city,state,country,latitude,longitude
        if (r.iata && r.name && r.city && r.state && r.country && r.latitude && r.longitude) {
            //var indexOrigin = formatted.nodes.findIndex(x => x.id == r.origin);
            //var indexDestination = formatted.nodes.findIndex(x => x.id == r.destination);

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

       
    });

    //do something with the finished product
    //console.log(formatted);
    var json = JSON.stringify(formatted);

    fs.writeFile("airport_codes.json", JSON.stringify(formatted), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );

}