// Calling this a store, although the state never changes. Could perhaps move
// to a Globals file, if more such global unchanging state is needed

var d3 = require("d3");

// Interaction color scale
var epsilon = Number.EPSILON;
var colorScale = d3.scaleLinear()
    .domain([-10, -epsilon, 0, epsilon, 10])
    .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]);

var InteractionColorStore = {
  getColorScale: function() { return colorScale; }
};

module.exports = InteractionColorStore;
