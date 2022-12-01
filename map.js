// Waiting until document has loaded
//import flight_and_airport_JSON from './flight_and_airport.json' assert {type: 'json'};

function MapGraphSVG() {

  //get heigth and width in our JS
  var screenWidth = 1 * window.screen.width;
  var screenHeight = 1 * window.screen.height;
  // The svg
  const svg = d3.select(".container").append("svg")
    .attr("width", screenWidth)
    .attr("height", screenHeight)
    .attr("id", "svgContainer")

  var width = +svg.attr("width");
  var height = +svg.attr("height");

  // Map and projection
  const projection = d3.geoMercator()
    .center([-99, 39])                // GPS of location to zoom on
    .scale(900)                       // This is like the zoom
    .translate([width / 2, height / 2])


  d3.json('./flight_and_airport.json').then(function (dataSet) {

    var colorScale = d3.scaleOrdinal().domain(dataSet.nodes)
      .range(d3.schemeCategory10);

    var r = d3.scaleLinear().range([10, 25]);
    r.domain([0, d3.max(dataSet.nodes, function (d) { return d.totalFlight; })]);

    var linkWidth = d3.scaleLinear().range([0.2, 10]);
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
          .projection(projection));


      var isclicked = false;
      var idClicked;


      var link = svg.append("g")
        .attr("class", "linkss")
        .selectAll("line")
        .data(dataSet.links)
        .enter().append("line")
        .attr("id", function (d) { return d.source + d.target })
        .attr("x1", function (d) { return projection([d.sourceLongitude, d.sourceLatitude])[0] })
        .attr("y1", function (d) { return projection([d.sourceLongitude, d.sourceLatitude])[1] })
        .attr("x2", function (d) { return projection([d.targetLongitude, d.targetLatitude])[0] })
        .attr("y2", function (d) { return projection([d.targetLongitude, d.targetLatitude])[1] })
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", function (d) { return linkWidth(d.totalFlightBeetween) })
        .on("mouseover", function (d) {
          if (isclicked === false) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html("Total flights: " + d.totalFlightBeetween + "<br>" + "Arrivals: " + d.arrival + "<br>" + "Departures: " + d.departure)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
            d3.select(this).attr("stroke", "#25fde9").attr("stroke-opacity", 1)
          } else {
            if ((this.id).includes(idClicked)) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html("Total flights: " + d.totalFlightBeetween + "<br>" + "Arrivals: " + d.arrival + "<br>" + "Departures: " + d.departure)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
              d3.select(this).attr("stroke", "#25fde9").attr("stroke-opacity", 1);
            }
          }
        })
        .on("mouseout", function (d) {
          if (isclicked === false) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            d3.select(this).attr("stroke", "#999").attr("stroke-opacity", 0.5)
          } else {
            if ((this.id).includes(idClicked)) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              d3.select(this).attr("stroke", "#999").attr("stroke-opacity", 0.5)
            }
          }
        });
      // Add circles:
      svg
        .selectAll("myCircles")
        .data(dataSet.nodes)
        .join("circle")
        .attr("cx", function (d) { return projection([d.longitude, d.latitude])[0]; })
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", function (d) { return r(d.totalFlight); })
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.8)
        .attr("fill-opacity", 1)
        .on("mouseover", function (d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(d.id + " " + d.nameAirport + "<br>" + "Total flights: " + d.totalFlight)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
          if (isclicked === false) {
            d3.selectAll("[id*=" + d.id + "]").attr("stroke", "#25fde9").attr("stroke-opacity", 0.8)
            d3.selectAll("line:not([id*=" + d.id + "])").attr("stroke-opacity", 0.2)
          } else {
          }
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
          if (isclicked === false) {
            d3.selectAll("line").attr("stroke", "#999")
            d3.selectAll("line").attr("stroke-opacity", 0.5)
          } else {
          }
        })
        .on("click", function (d) {
          if (isclicked === false) {
            d3.selectAll("line:not([id*=" + d.id + "])").attr("stroke-opacity", 0);
            d3.selectAll("[id*=" + d.id + "]").attr("stroke", "#999").attr("stroke-opacity", 0.5);
            isclicked = !isclicked;
            idClicked = d.id;
          } else {
            d3.selectAll("line").attr("stroke-opacity", 0.5)
            isclicked = !isclicked;
          }
        })
        .style("fill", function (d) { return colorScale(d.state) });
    });
  });
}
