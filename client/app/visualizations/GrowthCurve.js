var d3 = require("d3");

module.exports = function() {
      // Size
  var width = 200,
      height = 200,

      // Data
      data,

      // Start with empty selection
      svg = d3.select();

  function growthCurve(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "growthCurve")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      svg = svg.merge(svgEnter);

      draw();
    });
  }

  function draw() {
    // Update svg size
    svg .attr("width", width)
        .attr("height", height);
  };

  growthCurve.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return growthCurve;
  };

  growthCurve.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return growthCurve;
  };

  return growthCurve;
}
