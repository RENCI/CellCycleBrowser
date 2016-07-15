var d3 = require("d3");

var ChordMap = {};

ChordMap.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "chordMap")
      .attr("width", props.width)
      .attr("height", props.height);

  var g = svg.append("g");

  g.append("g")
      .attr("class", "groups");

  g.append("g")
      .attr("class", "ribbons");

  this.update(element, state);
};

ChordMap.update = function(element, state) {
  var svg = d3.select(element).select(".chordMap");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this._layout(svg, state.map);

  this._draw(svg, layout, state.map);
};

ChordMap._layout = function(svg, map) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10),
      outerRadius = Math.min(width, height) * 0.5 - 40,
      innerRadius = outerRadius * 0.9;

  var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

  var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

  var ribbon = d3.ribbon()
      .radius(innerRadius);

  var color = d3.scaleOrdinal()
      .domain(d3.range(map.matrix.length))
      .range(["#000000", "#FFDD89", "#957244", "#F26223", "#446"]);

  return {
    chord: chord,
    arc: arc,
    ribbon: ribbon,
    color: color
  };
};

ChordMap.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

ChordMap._draw = function(svg, layout, map) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var g = svg.select("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
      .datum(layout.chord(map.matrix));

  // Arcs for groups
  var group = g.select(".groups").selectAll("path")
      .data(function(chords) { return chords.groups; });

  group.enter().append("path")
      .style("fill", "white")
      .style("stroke", "white")
    .merge(group).transition()
      .style("fill", function(d) { return layout.color(d.index); })
      .style("stroke", function(d) { return d3.rgb(layout.color(d.index)).darker(); })
      .attr("d", layout.arc);

  group.exit()
      .style("fill", "white")
      .style("stroke", "white")
      .remove();

  // Ribbons for chords
  var ribbon = g.select(".ribbons").selectAll("path")
      .data(function(chords) { return chords; });

  ribbon.enter().append("path")
      .style("fill", "white")
      .style("stroke", "white")
    .merge(ribbon).transition()
      .attr("d", layout.ribbon)
      .style("fill", function(d) { return layout.color(d.target.index); })
      .style("stroke", function(d) { return d3.rgb(layout.color(d.target.index)).darker(); })
      .style("fill-opacity", 0.67);

  ribbon.exit()
      .style("fill", "white")
      .style("stroke", "white")
      .remove();
};

module.exports = ChordMap;
