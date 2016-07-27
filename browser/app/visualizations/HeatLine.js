var d3 = require("d3");

var HeatLine = {};

HeatLine.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatLine")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");

  this.update(element, state);
};

HeatLine.update = function(element, state) {
  var svg = d3.select(element).select(".heatLine");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state.data);

  this.draw(svg, layout, state);
};

HeatLine.layout = function(svg, data) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var xScale = d3.scaleBand()
      .domain(d3.range(data.length))
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

  var g = svg.select("g")
      .datum(state.data);

  // Cells
  var cell = g.selectAll(".cell")
      .data(function(d) { return d; });

  cell.enter().append("rect")
      .attr("class", "cell")
      .attr("x", function(d, i) { return layout.xScale(i); })
      .attr("width", layout.xScale.bandwidth())
      .attr("height", height)
      .attr("data-toggle", "tooltip")
      .attr("title", function(d) { return d.toPrecision(3); })
      .style("fill", "white")
    .merge(cell).transition()
      .attr("x", function(d, i) { return layout.xScale(i); })
      .attr("width", layout.xScale.bandwidth())
      .attr("height", height)
      .attr("title", function(d) { return d; })
      .style("fill", function(d) { return state.colorScale(d); });

  cell.exit().transition()
      .style("fill", "white")
      .remove();
};

module.exports = HeatLine;
