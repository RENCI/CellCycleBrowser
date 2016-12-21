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
      .attr("class", "borders")
  g.append("g")
      .attr("class", "rows");
  g.append("rect")
      .attr("class", "highlight")
      .style("shape-rendering", "crispEdges")
      .style("pointer-events", "none")
      .style("fill", "none")
      .style("stroke", "none")
      .style("stroke-width", 2);

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

  // Borders
  var border = g.select(".borders").selectAll(".border")
      .data(function(d) { return d; });

  border.enter().append("rect")
      .attr("class", "border")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 4)
    .merge(border).transition()
      .attr("x", function(d) { return layout.xScale(rowOffset(d)); })
      .attr("y", function(d, i) { return layout.yScale(i); })
      .attr("width", function(d) {
        return d.length * layout.xScale.bandwidth();
      })
      .attr("height", layout.yScale.bandwidth());

  // Rows
  var row = g.select(".rows").selectAll(".cellRow")
      .data(function(d) { return d; });

  row.enter().append("g")
      .attr("class", "cellRow")
    .merge(row)
      .attr("transform", function(d, i) {
        return "translate(0," + layout.yScale(i) + ")";
      })
      .each(cells);

  row.exit().remove();

  function cells(row, rowIndex) {
    function x(d, i) {
      return layout.xScale(i + rowOffset(row));
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
        .on("mouseover", function(d, i) {
          var rect = d3.select(this);

          g.select(".highlight")
              .attr("x", rect.attr("x"))
              .attr("y", layout.yScale(rowIndex))
              .attr("width", rect.attr("width"))
              .attr("height", rect.attr("height"))
              .style("stroke", highlightColor(state.colorScale(d)));

          function highlightColor(color) {
            var hcl = d3.hcl(color);
            var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

            return d3.hcl(0, 0, l);
          }
        })
        .on("mouseout", function() {
          // Remove border
          g.select(".highlight")
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

  function rowOffset(row) {
    var domain = layout.xScale.domain(),
        maxRowLength = domain[domain.length - 1];

    return state.alignment === "right" ?
           maxRowLength - row.length + 1 :
           0;
  }
};

module.exports = HeatMap;
