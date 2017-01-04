var d3 = require("d3");

module.exports = function() {
      // Size
  var width = 200,
      height = 50,

      // Data
      timeExtent,

      // Layout
      scale = d3.scaleLinear(),

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectTime");

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

      var g = svgEnter.append("g");

      svg = svg.merge(svgEnter);

      draw();
    });
  }

  function draw() {
    svg .attr("width", width)
        .attr("height", height);
  }

  timeScale.update = function() {
    draw();
  };

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

  // For registering event callbacks
  timeScale.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? timeScale : value;
  };

  // Initialize event callbacks
  timeScale.selectTime = function(_) {
    console.log(_);
    return timeScale;
  };

  timeScale.on("selectTime", timeScale.selectTime);

  return timeScale;
}
