var d3 = require("d3");

module.exports = function() {
      // Size
  var width = 200,
      height = 50,

      // Data
      timeExtent,

      // Layout
      alignment = "left",
      scale = d3.scaleLinear(),
      axis = d3.axisTop(scale)
          .tickSizeOuter(0),

      // Start with empty selection
      svg = d3.select();

  function timeScale(selection) {
    selection.each(function(d) {
      timeExtent = d;

      svg = d3.select(this).selectAll("svg")
          .data([timeExtent]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "timeScale")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      svgEnter.append("g");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Set scale domain for axis based on alignment
    if (alignment === "left") {
      scale.domain(timeExtent);
    }
    else if (alignment === "justify") {
      scale.domain([0, 100]);
    }
    else if (alignment === "right") {
      scale.domain([-timeExtent[1], -timeExtent[0]]);
    }

    // Set scale range
    scale.range([0, width]);

    // Remove all ticks to fix issue with last tick
    svg.selectAll(".tick").remove();

    // Draw axis
    svg.select("g")//.transition()
        .attr("transform", "translate(0," + (height) + ")")
        .call(axis);

    // Remove first and last ticks
    var ticks = svg.selectAll(".tick")

    ticks.style("visibility", function(d, i) {
      return i === 0 || i === ticks.size() - 1 ? "hidden" : null;
    });
  }

  timeScale.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return timeScale;
  };

  timeScale.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return timeScale;
  };

  timeScale.alignment = function(_) {
    if (!arguments.length) return alignment;
    alignment = _;
    return timeScale;
  };

  return timeScale;
}
