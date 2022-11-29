const csv = require('csvtojson');

var fs = require('fs');

const csvFilePath = 'flight.csv';

var data = [];

console.log(csvFilePath);

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
            //console.log(r.origin)

            var indexOrigin = formatted.nodes.findIndex(x => x.id == r.origin);
            var indexDestination = formatted.nodes.findIndex(x => x.id == r.destination);

            if (indexOrigin === -1) {
                formatted.nodes.push({ id: r.origin, group: compteur, totalFlight: r.count });
                compteur++;

            } else {
                formatted.nodes[indexOrigin].totalFlight = parseInt(formatted.nodes[indexOrigin].totalFlight) + parseInt(r.count)
            }


            if (indexDestination === -1) {
                formatted.nodes.push({ id: r.destination, group: compteur, totalFlight: r.count });
                compteur++;

            }
            else {
                formatted.nodes[indexDestination].totalFlight = parseInt(formatted.nodes[indexDestination].totalFlight) + parseInt(r.count)
            }



        }

        if (r.origin && r.destination && r.count) {

            var indexOriginLinks = formatted.links.findIndex((x) => {
                return (x.source == r.origin && x.target == r.destination) || (x.target == r.origin && x.source == r.destination)
            });

            console.log(indexOriginLinks)
            if (indexOriginLinks === -1) {
                formatted.links.push({ source: r.origin, target: r.destination, totalFlightBeetween: r.count, departure : parseInt(r.count) ,arrival :0 });
            } else {
                formatted.links[indexOriginLinks].totalFlightBeetween = parseInt(formatted.links[indexOriginLinks].totalFlightBeetween) + parseInt(r.count)
                formatted.links[indexOriginLinks].arrival = parseInt(r.count)
            }


        }
    });

    //do something with the finished product
    //console.log(formatted);
    var json = JSON.stringify(formatted);

    fs.writeFile("input.json", JSON.stringify(formatted), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );

}