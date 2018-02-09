var d3 = require("d3");

module.exports = function() {
      // Size
  var nodeRadius = 0,
      margin = { top: 0, left: nodeRadius, bottom: 0, right: nodeRadius },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return height - margin.top - margin.bottom; },

      // Data
      cluster,

      // Appearance
      color =  "#ccc",

      // Start with empty selection
      svg = d3.select();

  function dendrogram(selection) {
    selection.each(function() {
      svg = d3.select(this).selectAll("svg")
          .data([cluster]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "dendrogram")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

      // Groups for layout
      g.append("g").attr("class", "links");
      g.append("g").attr("class", "nodes");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height);

    // Do dendrogram layout
    var hierarchy = d3.hierarchy(cluster.tree());

    var tree = d3.cluster()
        .size([innerHeight(), innerWidth()])
        .separation(function() { return 1; });

    tree(hierarchy);

    // Draw
    drawNodes();
    drawLinks();

    function drawNodes() {
      var node = svg.select(".nodes").selectAll(".node")
          .data(hierarchy.descendants());

      var nodeEnter = node.enter().append("circle")
          .attr("class", "node")
          .attr("r", nodeRadius)
          .style("fill", color);

      nodeEnter.merge(node)
          .attr("cx", function(d) { return d.y; })
          .attr("cy", function(d) { return d.x; });

      node.exit().remove();
    }

    function drawLinks() {
/*
      var link = svg.select(".links").selectAll(".link")
          .data(hierarchy.descendants().slice(1));

      var linkEnter = link.enter().append("line")
          .attr("class", "link")
          .style("fill", "none")
          .style("stroke", "black");

      linkEnter.merge(link)
          .attr("x1", function(d) { return d.y; })
          .attr("y1", function(d) { return d.x; })
          .attr("x2", function(d) { return d.parent.y; })
          .attr("y2", function(d) { return d.parent.x; });

      link.exit().remove();
*/
      var elbow = function (d) {
        return "M" + d.y + "," + d.x
          + "V" + d.parent.x + "H" + d.parent.y;
      };

      var elbow2 = d3.linkHorizontal()
          .source(function(d) { return d; })
          .target(function(d) { return d.parent; })
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; });

      var link = svg.select(".links").selectAll(".link")
          .data(hierarchy.descendants().slice(1));

      var linkEnter = link.enter().append("path")
          .attr("class", "link")
          .style("fill", "none")
          .style("stroke", color);

      linkEnter.merge(link)
          .attr("d", elbow2);

      link.exit().remove();
    }
  }

  dendrogram.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return dendrogram;
  };

  dendrogram.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return dendrogram;
  };

  dendrogram.cluster = function(_) {
    if (!arguments.length) return cluster;
    cluster = _;
    return dendrogram;
  };

  return dendrogram;
}
