// Waiting until document has loaded
import flight_and_airport_JSON from './flight_and_airport.json' assert {type: 'json'};



window.onload = () => {

  //get heigth and width in our JS
  var screenWidth = 0.9 * window.screen.width;
  var screenHeight = 0.9 * window.screen.height;

  var color = d3.scaleOrdinal(d3.schemeCategory10);




  // The svg
  const svg = d3.select("svg")
    .attr("width", screenWidth)
    .attr("height", screenHeight)

  var width = +svg.attr("width");
  var height = +svg.attr("height");

  // Map and projection
  const projection = d3.geoMercator()
    .center([-99, 39])                // GPS of location to zoom on
    .scale(1000)                       // This is like the zoom
    .translate([width / 2, height / 2])


  //console.log(flight_and_airport_JSON);




  const dataSet = flight_and_airport_JSON;

  var colorScale = d3.scaleOrdinal().domain(dataSet.nodes)
    .range(d3.schemeSet3);

  var r = d3.scaleLinear().range([10, 25]);
  r.domain([0, d3.max(dataSet.nodes, function (d) { return d.totalFlight; })]);

  var linkWidth = d3.scaleLinear().range([0.2, 15]);
  linkWidth.domain([0, d3.max(dataSet.links, function (d) { return d.totalFlightBeetween; })]);



  var div = d3.select(".graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);




  // Load external data and boot
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

    // Filter data
    data.features = data.features.filter(d => d.properties.name == "USA")

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(data.features)
      .join("path")
      .style("stroke", "white")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 2)
      .attr("fill", "#b8b8b8")
      .style("opacity", 0.3)
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      ;



    var link = svg.append("g")
      .attr("class", "linkss")
      .selectAll("line")
      .data(dataSet.links)
      .enter().append("line")
      .attr("x1", function (d) { return projection([d.sourceLongitude, d.sourceLatitude])[0] })
      .attr("y1", function (d) { return projection([d.sourceLongitude, d.sourceLatitude])[1] })
      .attr("x2", function (d) { return projection([d.targetLongitude, d.targetLatitude])[0] })
      .attr("y2", function (d) { return projection([d.targetLongitude, d.targetLatitude])[1] })
      //.attr("fill", "red")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", function (d) { return linkWidth(d.totalFlightBeetween) })

      .on("mouseover", function (d) {
        console.log(d.totalFlightBeetween)
        d3.select(this).attr("stroke", "red")
        d3.select(this).attr("stroke-opacity", 1)

        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.totalFlightBeetween)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");




      })
      .on("mouseout", function (d) {
        d3.select(this).attr("stroke", "#999")
        d3.select(this).attr("stroke-opacity", 0.5)

        div.transition()
          .duration(500)
          .style("opacity", 0);

      });




    // Add circles:
    svg
      .selectAll("myCircles")
      .data(dataSet.nodes)
      .join("circle")
      .attr("cx", function (d) {

        //console.log(projection([d.longitude, d.latitude])[0])
        return projection([d.longitude, d.latitude])[0];
      })
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", function (d) { return r(d.totalFlight); })
      //.style("fill", "69b3a2")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.6)
      .attr("fill-opacity", 0.8)
      .on("mouseover", function (d) {
        console.log(d.id)
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.id + "<br>" + d.totalFlight)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .style("fill", function (d) { return colorScale(d.state) });








    /* 
    
     */








    /* svg 
    .selectAll("myLines")
    .data(dataSet.nodes)
    .join("line")
    .attr("cx", d => projection([d.longitude, d.latitude])[0])
    .attr("cy", d => projection([d.longitude, d.latitude])[0])
    .attr("r", function (d) { return r(d.totalFlight); })
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.6)
    .attr("fill-opacity", 0.8)
    .style("fill", "red")
    ;
*/


    /* .on("mouseover", function (d) {
      console.log(d.totalFlightBeetween)
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.totalFlightBeetween + "<br>")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
     */
  })


};
