var d3 = require("d3");

var ChordMap = {};

ChordMap.create = function(element, props, state) {
  var svg = d3.select(element).append("svg")
      .attr("class", "d3")
      .attr("width", props.width)
      .attr("height", props.height);

  svg.append("g")
      .attr("class", "d3-points");

  this.update(element, state);
};

ChordMap.update = function(element, state) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(element, state.domain);
  this._drawPoints(element, scales, state.data);
};

ChordMap._scales = function(element, domain) {
  if (!domain) {
    return null;
  }

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  var x = d3.scaleLinear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain(domain.y);

  var z = d3.scaleLinear()
    .range([5, 20])
    .domain([1, 10]);

  return {x: x, y: y, z: z};
};

ChordMap.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

ChordMap._drawPoints = function(element, scales, data) {
  var g = d3.select(element).selectAll(".d3-points");

  var point = g.selectAll(".d3-point")
    .data(data, function(d) { return d.id; });

  // Enter + update
  point.enter().append("circle")
      .attr("class", "d3-point")
   .merge(point)
      .attr("cx", function(d) { return scales.x(d.x); })
      .attr("cy", function(d) { return scales.y(d.y); })
      .attr("r", function(d) { return scales.z(d.z); });

  // Exit
  point.exit().remove();
};

module.exports = ChordMap;
