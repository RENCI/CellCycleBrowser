var d3 = require("d3");

module.exports = function() {
      // Size
  var width = 200,
      height = 50,

      // Data
      timeExtent,

      // Layout
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

    // Set scale for axis
    scale
        .domain(timeExtent)
        .range([0, width]);

    // Draw axis
    svg.select("g")//.transition()
        .attr("transform", "translate(0," + (height) + ")")
        .call(axis);

    // Remove first and last ticks
    var ticks = svg.selectAll(".tick");

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

  return timeScale;
}
