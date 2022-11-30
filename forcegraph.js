
function ForceGraphSVG(){

  
        var screenWidth = 0.95 * window.screen.width;
        var screenHeight = 0.85 * window.screen.height;
    
        const svg = d3.select(".container").append("svg")
            .attr("width", screenWidth)
            .attr("height", screenHeight)
            .attr("id", "svgContainer")

        var width = +svg.attr("width");
        var height = +svg.attr("height");
    
        var color = d3.scaleOrdinal(d3.schemeCategory10);
    
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));
    
        d3.json("input.json").then(function (data) {
            var linkWidth = d3.scaleLinear().range([0.2, 6]);
            linkWidth.domain([0, d3.max(data.links, function (d) { return d.totalFlightBeetween; })]);
    
            var r = d3.scaleLinear().range([3, 15]);
            r.domain([0, d3.max(data.nodes, function (d) { return d.totalFlight; })]);
    
            var div = d3.select(".graph").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
    
            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("id", function (d) { return d.source + d.target })
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", function (d) { return linkWidth(d.totalFlightBeetween) })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Total flights: " + d.totalFlightBeetween + "<br>" + "Arrivals: " + d.arrival + "<br>" + "Departures: " + d.departure)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                    d3.select(this).attr("stroke", "red")
                    //d3.select(this).attr("stroke-opacity", 1)
                })
                .on("mouseout", function (d) {
                    d3.select(this).attr("stroke", "#999")
                    //d3.select(this).attr("stroke-opacity", 0.5)
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
    
            var isclicked = false;
    
            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r", function (d) { return r(d.totalFlight); })
                .attr("fill", function (d) { return color(d.group); })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(d.id + "<br>" +"Total flights: " + d.totalFlight)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                    d3.selectAll("[id*=" + d.id + "]").attr("stroke", "red")
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
    
                    d3.selectAll("line").attr("stroke", "#999")
                })
                .on("click", function (d) {
                    if (isclicked === false) {
                        d3.selectAll("line:not([id*=" + d.id + "])").attr("stroke-opacity", "0");
                        isclicked = !isclicked;
                    } else {
                        d3.selectAll("line").attr("stroke-opacity", "1")
                        isclicked = !isclicked;
                    }
    
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
    
    
            simulation
                .nodes(data.nodes)
                .on("tick", ticked);
    
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
    

}


