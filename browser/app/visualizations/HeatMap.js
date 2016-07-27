var d3 = require("d3");

var HeatMap = {};

HeatMap.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatMap")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");

  g.append("g")
      .attr("class", "rows");

  this.update(element, state);
};

HeatMap.update = function(element, state) {
  var svg = d3.select(element).select(".heatMap");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state.data);

  this.draw(svg, layout, state);
};

HeatMap.layout = function(svg, data) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var xScale = d3.scaleBand()
      .domain(d3.range(d3.max(data, function(d) { return d.length; })))
      .range([0, width]);

  var yScale = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([0, height]);

  return {
    xScale: xScale,
    yScale: yScale
  };
};

HeatMap.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

HeatMap.draw = function(svg, layout, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var g = svg.select("g")
      .datum(state.data);

  // Rows
  var row = g.select(".rows").selectAll(".cellRow")
      .data(function(d) { return d; });

  row.enter().append("g")
      .attr("class", "cellRow")
    .merge(row)
      .attr("transform", function(d, i) {
        return "translate(0," + layout.yScale(i) + ")";
      })
      .call(cell);

  row.exit().remove();

  function cell(selection) {
    // Cells
    var cell = selection.selectAll(".cell")
        .data(function(d) { return d; });

    cell.enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return layout.xScale(i); })
        .attr("width", layout.xScale.bandwidth())
        .attr("height", layout.yScale.bandwidth())
        .attr("data-toggle", "tooltip")
        .attr("title", function(d) { return d; })
        .style("fill", "white")
        .style("stroke", "white")
      .merge(cell).transition()
        .attr("x", function(d, i) { return layout.xScale(i); })
        .attr("width", layout.xScale.bandwidth())
        .attr("height", layout.yScale.bandwidth())
        .attr("title", function(d) { return d; })
        .style("fill", function(d) { return state.colorScale(d); })
        .style("stroke", function(d) { return state.colorScale(d); });

    cell.exit().transition()
        .style("fill", "white")
        .remove();
  }
};

module.exports = HeatMap;
