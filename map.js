// Waiting until document has loaded
import airport_codes_JSON from './airport_codes_simplified.json' assert {type: 'json'};



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


  // Create data for circles:
  /*   const markers = [
      { long: -90.083, lat: 42.149 }, // corsica
      { long: 7.26, lat: 43.71 }, // nice
      { long: 2.349, lat: 48.864 }, // Paris
      { long: -1.397, lat: 43.664 }, // Hossegor
      { long: 3.075, lat: 50.640 }, // Lille
      { long: -3.83, lat: 58 }, // Morlaix
    ]; */


  console.log(airport_codes_JSON);


  const markers = airport_codes_JSON;




  // Load external data and boot
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

    // Filter data
    data.features = data.features.filter(d => d.properties.name == "USA")

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(data.features)
      .join("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .style("stroke", "black")
      .style("opacity", .3)

    // Add circles:
    svg
      .selectAll("myCircles")
      .data(markers)
      .join("circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", 14)
      .style("fill", "69b3a2")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 3)
      .attr("fill-opacity", .4)
  })


};
