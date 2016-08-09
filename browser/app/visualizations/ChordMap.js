var d3 = require("d3");

module.exports = function() {
  var width = 200,
      height = 200,
      svg = d3.select(),
      dispatcher = d3.dispatch("selectSpecies");

  function chordMap(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "chordMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      svg = svg.merge(svgEnter);

      var g = svgEnter.append("g");

      g.append("g")
        .attr("class", "ribbons");

      g.append("g")
          .attr("class", "groups");

      draw(layout());
    });
  }

  function draw(layout) {
    svg .attr("width", width)
        .attr("height", height);

    var g = svg.select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .datum(function(d) { return layout.chord(d.matrix); });

    // Arcs for groups
    var group = g.select(".groups").selectAll("path")
        .data(function(chords) { return chords.groups; });

    group.enter().append("path")
        .style("fill", "white")
        .style("stroke", "white")
        .on("click", function(d) {
          dispatcher.call("selectSpecies", this, "Species: " + d.index);
        })
        .on("mouseover", function() {
          d3.select(this).style("stroke-width", 2);
        })
        .on("mouseout", function() {
          d3.select(this).style("stroke-width", null);
        })
      .merge(group).transition().duration(0)
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
      .merge(ribbon).transition().duration(0)
        .attr("d", layout.ribbon)
        .style("fill", function(d) { return layout.color(d.target.index); })
        .style("stroke", function(d) { return d3.rgb(layout.color(d.target.index)).darker(); })
        .style("fill-opacity", 0.67);

    ribbon.exit()
        .style("fill", "white")
        .style("stroke", "white")
        .remove();
  }

  function layout() {
    var outerRadius = Math.min(width, height) * 0.5 - 40,
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
        .domain(d3.range(data.matrix.length))
        .range(["#000000", "#FFDD89", "#957244", "#F26223", "#446"]);

    return {
      chord: chord,
      arc: arc,
      ribbon: ribbon,
      color: color
    };
  }

  chordMap.update = function() {
    draw(layout());
  };

  chordMap.destroy = function(element) {
    // Any clean-up would go here
    // in this example there is nothing to do
  };

  chordMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chordMap;
  };

  chordMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chordMap;
  };

  // For registering event callbacks
  chordMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? chordMap : value;
  };

  // Initialize event callbacks
  chordMap.selectSpecies = function(_) {
    console.log("ChordMap, " + _);
    return chordMap;
  }

  chordMap.on("selectSpecies", chordMap.selectSpecies);

  return chordMap;
}
