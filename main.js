var d3; // Minor workaround to avoid error messages in editors

// Waiting until document has loaded
window.onload = () => {


  //get heigth and width in our JS
  var screenWidth = 0.6 * window.screen.width;
  var screenHeight = 0.80 * window.screen.height;
  console.log(window.screen.width)


  // config radar chart :
  var radarChartOptions = {
    roundStrokes: true,
  };

  // set the dimensions and margins of the graph
  var margin = { top: 0.04 * window.screen.height, right: screenWidth / 20, bottom: 0.05 * window.screen.height, left: screenWidth / 20 },
    width = screenWidth,
    height = screenHeight;


  var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("cars.csv").then(function (data) {
    compteur = 0;


    // parse data and add a compteur to set id
    data.forEach(function (d) {
      d.idData = compteur
      d.weight = parseInt(d.Weight);
      d.cityMilesPerGallon = parseInt(d.CityMilesPerGallon);
      d.engine = parseInt(d.Engine_Size);
      d.horsepower = parseInt(d.Horsepower);
      d.price = parseInt(d.Retail_Price);
      d.cylindree = parseInt(d.Cyl);
      compteur = compteur + 1;
    });


    // set the ranges
    var y = d3.scaleLinear().range([height, 0]);
    var x = d3.scaleLinear().range([0, width]);
    // Scale the range of the data
    x.domain([0, d3.max(data, function (d) { return d.weight; })]);
    y.domain([0, d3.max(data, function (d) { return d.cityMilesPerGallon; })]);
    y.domain([0, 30]);


    var r = d3.scaleLinear().range([3, 12]);
    r.domain([0, d3.max(data, function (d) { return d.horsepower; })]);


    //color scale for one of our attribute
    var colorScale = d3.scaleOrdinal().domain(data)
      .range(d3.schemeSet1);

    var div = d3.select(".graph").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add the scatterplot
    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", function (d) { return r(d.horsepower) })
      .attr("fill", function (d) { return colorScale(d.Type) })
      .attr("opacity", 0.5)
      .attr("cx", function (d) { return x(d.weight); })
      .attr("cy", function (d) { return y(d.cityMilesPerGallon); })
      .on("mouseover", function (d) {
        //Call function to draw the Radar chart
        RadarChart(".radarChart", radarChartOptions, d.idData);
        //Call table on hover
        Tabulate(data[d.idData]);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.Name + "<br>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });



    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top)
      .text("Weight (kg)");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height / 2 + 20)
      .text("City Miles Per Gallon (Miles)")





    // select the svg area
    var Svg = d3.select("#color_legend")
    // create a list of keys
    var keys = [];

    for (let i = 0; i < data.length; i++) {
      if (keys.indexOf(data[i]['Type']) === -1) {
        keys.push(data[i]['Type']);
      }
    }

    // Add one dot in the legend for each name.
    Svg.selectAll("mydots")
      .data(keys)
      .enter()
      .append("circle")
      .attr("cx", 10)
      .attr("cy", function (d, i) { return 10 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function (d) { return colorScale(d) })

    // Add one dot in the legend for each name.
    Svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", function (d, i) { return 10 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) { return colorScale(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")




    // append the svg object to the body of the page

    var svgLegendSize = d3.select("#size_legend")
      .append("svg")

    // Add legend: circles
    var valuesToShow = [100, 250, 500]
    var xCircle = 23
    var xLabel = 50
    var yCircle = 80
    svgLegendSize
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function (d) { return yCircle - r(d) })
      .attr("r", function (d) { return r(d) })
      .style("fill", "none")
      .attr("stroke", "black")

    // Add legend: segments
    svgLegendSize
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', function (d) { return xCircle + r(d) * 0.8 })
      .attr('x2', xLabel)
      .attr('y1', function (d) { return yCircle - r(d) * 2 })
      .attr('y2', function (d) { return yCircle - r(d) * 4.5 })
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svgLegendSize
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr('x', xLabel)
      .attr('y', function (d) { return yCircle - r(d) * 4.5 })
      .text(function (d) { return (d + " HP") })
      .style("font-size", 15)
      .attr('alignment-baseline', 'middle')







  });

};
