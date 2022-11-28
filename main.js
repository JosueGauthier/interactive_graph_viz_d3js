// Waiting until document has loaded






window.onload = () => {

  //get heigth and width in our JS
  var screenWidth = 1 * window.screen.width;
  var screenHeight = 0.85 * window.screen.height;
  // set the dimensions and margins of the graph
  /* var margin = { top: 0.04 * window.screen.height, right: screenWidth / 20, bottom: 0.05 * window.screen.height, left: screenWidth / 20 },
    width = screenWidth,
    height = screenHeight; */

  var svg = d3.select(".graph").append("svg")
    .attr("width", screenWidth)
    .attr("height", screenHeight)
    .append("g");
    


  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width/2 , height / 2));


  d3.json("input.json").then(function (data) {

    var div = d3.select(".graph").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    var linkWidth = d3.scaleLinear().range([0.2, 3]);
    linkWidth.domain([0, d3.max(data.links, function (d) { return d.value; })]);



    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .on("mouseover", function (d) {
        console.log(d.value)
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.value + "<br>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .attr("stroke-width", function (d) { return linkWidth(d.value) });

    /* 
        var linksout = svg.append("g")
          .attr("class", "linksout")
          .selectAll("line")
          .data(data.links)
          .enter().append("line")
          .on("mouseover", function (d) {
            console.log(d.value)
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(d.value + "<br>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          })
          .on("mouseout", function (d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          })
          
          .attr("stroke-width", function (d) { return Math.exp(d.value / 10000); }); */


    var r = d3.scaleLinear().range([3, 15]);
    r.domain([0, d3.max(data.nodes, function (d) { return d.totalFlight; })]);




    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", function (d) { return r(d.totalFlight); })
      .attr("fill", function (d) { return color(d.group); })
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
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("text")
      .text(function (d) {
        return d.id;

      })
      .style("font-size", 15)
      .style("fill", "red")
      .attr('alignment-baseline', 'middle')
      .attr('x', 6)
      .attr('y', 3);

    node.append("title")
      .text(function (d) { return d.id; });

    simulation
      .nodes(data.nodes)
      .on("tick", ticked);

    /* simulation.force("linksout")
      .links(data.links); */


    simulation.force("link")
      .links(data.links);





    function ticked() {

      link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
    }
  });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


};
