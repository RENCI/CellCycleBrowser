var d3 = require("d3");

var HeatMap = {};

HeatMap.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatMap")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");

  g.append("g").attr("class", "rows");

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
      .each(cell);

  row.exit().remove();

  function cell(row) {
    var domain = layout.xScale.domain(),
        maxRowLength = domain[domain.length - 1],
        offset = maxRowLength - row.length + 1;

    function x(d, i) {
      return layout.xScale(i + offset);
    }

    // Bind cell data
    var cell = d3.select(this).selectAll(".cell")
        .data(function(d) { return d; });

    // Enter + update
    cell.enter().append("rect")
        .attr("class", "cell")
        .attr("x", x)
        .attr("width", layout.xScale.bandwidth())
        .attr("height", layout.yScale.bandwidth())
        .attr("shape-rendering", "crispEdges")
        .attr("data-toggle", "tooltip")
        .attr("title", function(d) { return d; })
        .style("fill", "white")
        .style("stroke-width", 2)
        .on("mouseover", function() {
          // Raise parent row
          d3.select(this.parentNode)
              .raise();

          // Raise this cell and show border
          d3.select(this)
              .style("stroke", function(d) {
                return highlightColor(state.colorScale(d));
              })
              .raise();

          function highlightColor(color) {
            var hcl = d3.hcl(color);
            var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

            return d3.hcl(0, 0, l);
          }
        })
        .on("mouseout", function() {
          // Remove border
          d3.select(this)
              .style("stroke", "none");
        })
      .merge(cell).transition()
        .attr("x", x)
        .attr("width", layout.xScale.bandwidth())
        .attr("height", layout.yScale.bandwidth())
        .attr("title", function(d) { return d; })
        .style("fill", function(d) { return state.colorScale(d); });

    // Exit
    cell.exit().transition()
        .style("fill", "white")
        .remove();
  }
};

module.exports = HeatMap;
