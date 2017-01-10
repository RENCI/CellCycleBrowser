var d3 = require("d3");

var PhaseLine = {};

PhaseLine.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "PhaseLine")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");
  g.append("g")
      .attr("class", "row");
    g.append("rect")
        .attr("class", "border");
  g.append("rect")
      .attr("class", "highlight")
      .attr("shape-rendering", "crispEdges")
      .attr("pointer-events", "none")
      .style("fill", "none")
      .style("stroke", "none")
      .style("stroke-width", 2);

  this.update(element, state);
};

PhaseLine.update = function(element, state) {
  var svg = d3.select(element).select(".PhaseLine");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state);

  this.draw(svg, layout, state);
};

PhaseLine.layout = function(svg, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var timeExtent = [
    d3.min(state.data, function(d) { return d.start; }),
    d3.max(state.data, function(d) { return d.stop; })
  ];

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

PhaseLine.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

PhaseLine.draw = function(svg, layout, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  // Border
  var border = svg.select("g").select(".border")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", state.active ? "#999" : "#ddd")
      .style("stroke-width", 2)
    .transition()
      .attr("x", layout.xScale(state.data[0].start))
      .attr("width", layout.xScale(state.data[state.data.length - 1].stop) -
                     layout.xScale(state.data[0].start))
      .attr("height", height);

  // Row
  var row = svg.select("g").select(".row")
      .datum(state.data);

  // Cells
  function x(d) {
    return layout.xScale(d.start);
  }

  function w(d) {
    return layout.xScale(d.stop) - layout.xScale(d.start);
  }

  var format = d3.format(".1f");

  function label(d) {
    return d.name + ": " + format(d.stop - d.start) + "h";
  }

  var cell = row.selectAll(".cell")
      .data(function(d) { return d; });

  cell.enter().append("rect")
      .attr("class", "cell")
      .attr("x", x)
      .attr("width", w)
      .attr("height", height)
      .attr("shape-rendering", "crispEdges")
      .attr("data-toggle", "tooltip")
      .attr("data-original-title", label)
      .style("stroke-width", 2)
      .on("mouseover", function(d) {
        var rect = d3.select(this);

        svg.select(".highlight")
            .attr("x", rect.attr("x"))
            .attr("width", rect.attr("width"))
            .attr("height", height)
            .style("stroke", highlightColor(state.colorScale(d.name)));

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
      .on("click", function(d) {
        state.selectTrajectory({
          id: "average",
          phases: d
        });
      })
    .merge(cell)
      .style("fill", function(d) {
        return state.active ?
               highlightColor(state.colorScale(d.name)) :
               state.colorScale(d.name);
      })
    .transition()
      .attr("x", x)
      .attr("width", w)
      .attr("height", height)
      .attr("data-original-title", label);

  cell.exit().transition()
      .style("fill", "white")
      .remove();

  function highlightColor(color) {
    var hcl = d3.hcl(color);
    hcl.c *= 2;

    return hcl;
  }
};

module.exports = PhaseLine;
