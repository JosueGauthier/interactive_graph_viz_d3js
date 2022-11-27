const csv = require('csvtojson');

const csvFilePath = 'test.csv';

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

    data.forEach(function (r) {


        //check for your empty or 'None' fields here
        if (r.name && r.source) {
            formatted.nodes.push({ name: r.name, source: r.source });
        }

        if (r.source && r.target) {
            formatted.links.push({ source: r.source, target: r.target });
        }
    });

    //do something with the finished product
    console.log(formatted);
}