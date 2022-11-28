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

        if (r.origin) {
            console.log(r.origin)
            

            
            var index = formatted.nodes.findIndex(x => x.id == r.origin);
            // here you can check specific property for an object whether it exist in your array or not

            if (index === -1) {
                formatted.nodes.push({ id: r.origin, group: compteur });
                compteur++;
                
            }

            //index === -1 ?arrayObj.push({ your_object }) : console.log("object already exists")


            /*  if(formatted.nodes.indexOf({r.origin}) === -1) {
                 
                 
             } */


        }

        if (r.origin && r.destination && r.count) {
            formatted.links.push({ source: r.origin, target: r.destination, value: r.count });
        }
    });

    //do something with the finished product
    console.log(formatted);
    var json = JSON.stringify(formatted);
    
    //fs.writeFile('myjsonfile.json', json, 'utf8', callback);

    fs.writeFile ("input.json", JSON.stringify(formatted), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );

}