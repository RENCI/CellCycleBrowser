var d3 = require("d3");

module.exports = function() {
      // Size
  var nodeRadius = 1.5,
      margin = { top: 0, left: nodeRadius + 5, bottom: 0, right: nodeRadius },
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
      var spacing = Math.abs(hierarchy.leaves()[0].x - hierarchy.leaves()[1].x);

      var c = spacing / 2;

      var curveElbow = function(d) {
        var r = d3.min([c, Math.abs(d.parent.x - d.x), Math.abs(d.parent.y - d.y)]),
            up = d.parent.x > d.x;

        return "M" + d.y + "," + d.x
          + "H" + (d.parent.y + r)
          + "q" + -r + "," + 0 + "," + -r + "," + (up ? r : -r)
          + "V" + d.parent.x;
/*
        var diffx = d.parent.y - d.y,
            diffy = d.parent.x - d.x,
            v1 = diffx * c,
            v1 = Math.abs(diffy) > Math.abs(v1)
            v2 = diff - v1,
            v3 = d.parent.x > d.x ? -v2 : v2;

        return "M" + d.y + "," + d.x
          + "h" + v1
          + "q" + v2 + "," + 0 + "," + v2 + "," + v3
          + "V" + d.parent.x;
*/
      };

      var link = svg.select(".links").selectAll(".link")
          .data(hierarchy.descendants().slice(1));

      var linkEnter = link.enter().append("path")
          .attr("class", "link")
          .style("fill", "none")
          .style("stroke", color);

      linkEnter.merge(link)
          .attr("d", curveElbow);

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
