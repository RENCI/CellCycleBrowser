var d3 = require("d3");

var HeatLine = {};

HeatLine.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatLine")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");

  g.append("rect")
      .attr("class", "border");
  g.append("g")
      .attr("class", "row");
  g.append("rect")
      .attr("class", "highlight")
      .attr("shape-rendering", "crispEdges")
      .attr("pointer-events", "none")
      .style("fill", "none")
      .style("stroke", "none")
      .style("stroke-width", 2);

  this.update(element, state);
};

HeatLine.update = function(element, state) {
  var svg = d3.select(element).select(".heatLine");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state);

  this.draw(svg, layout, state);
};

HeatLine.layout = function(svg, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var timeExtent = d3.extent(state.data, function(d) { return d.time; });

  var xScale = d3.scaleLinear()
      .domain(state.alignment === "left" ?
              state.timeExtent :
              [state.timeExtent[0] - (state.timeExtent[1] - timeExtent[1]),
               timeExtent[1]])
      .range([0, width]);

  return {
    xScale: xScale
  };
};

HeatLine.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

HeatLine.draw = function(svg, layout, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  // Border
  var border = svg.select("g").select(".border")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 4)
    .transition()
      .attr("x", layout.xScale(state.data[0].time))
      .attr("width", layout.xScale(state.data[state.data.length - 1].time) -
                     layout.xScale(state.data[0].time) + 10)
      .attr("height", height);

  // Row
  var row = svg.select("g").select(".row")
      .datum(state.data);

  // Cells
  var cell = row.selectAll(".cell")
      .data(function(d) { return d; });

  cell.enter().append("rect")
      .attr("class", "cell")
      .attr("x", function(d) { return layout.xScale(d.time); })
      .attr("width", 10)
      .attr("height", height)
      .attr("shape-rendering", "crispEdges")
      .attr("data-toggle", "tooltip")
      .attr("data-original-title", function(d) { return d.value.toPrecision(3); })
      .style("fill", "white")
      .style("stroke-width", 2)
      .on("mouseover", function(d) {
        svg.select(".highlight")
            .attr("x", layout.xScale(d.time))
            .attr("width", 10)
            .attr("height", height)
            .style("stroke", highlightColor(color(d)));

        function highlightColor(color) {
          var hcl = d3.hcl(color);
          var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

          return d3.hcl(0, 0, l);
        }
      })
      .on("mouseout", function() {
        // Remove border
        svg.select(".highlight")
            .style("stroke", "none");
      })
    .merge(cell).transition()
      .attr("x", function(d) { return layout.xScale(d.time); })
      .attr("width", 10)
      .attr("height", height)
      .attr("data-original-title", function(d) { return d.value; })
      .style("fill", color);

  cell.exit().transition()
      .style("fill", "white")
      .remove();

  function color(d, row) {
    return state.phases.length > 0 ?
           state.colorScale(d.time)(d.value) :
           state.colorScale(d.value);
  }
};

module.exports = HeatLine;
