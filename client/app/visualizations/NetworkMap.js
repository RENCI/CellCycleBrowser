var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var ribbonArrow = require("./ribbonArrow/ribbonArrow");
var ribbonArrowOverlay = require("./ribbonArrow/ribbonArrowOverlay");
var ribbonCenterLine = require("./ribbonArrow/ribbonCenterLine");

module.exports = function() {
      // Size
  var width = 200,
      height = 200,

      // Data
      data,
      nodes,
      links,
      biLinks,
      currentPhase = null,

      // Layout
      piePadAngle = 0.04,
      pie = d3.pie()
          .value(function() { return 1; })
          .padAngle(piePadAngle),
      nodeRadiusScale = d3.scaleLinear()
          .range([3, 7]);
      force = d3.forceSimulation()
          .force("link", d3.forceLink())
          .force("x", d3.forceX(0).strength(0.02))
          .force("y", d3.forceY(0).strength(0.02))
          .force("collide", d3.forceCollide(10))
          .force("manyBody", d3.forceManyBody().strength(-15))
          .on("tick", updateForce),

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectPhase", "selectSpecies");

  function networkMap(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "networkMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      // Defs section for arrow markers for links
      svgEnter.append("defs");

      // Background
      svgEnter.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .style("visibility", "hidden")
          .style("pointer-events", "all")
          .on("click", function() {
            dispatcher.call("selectPhase", this, "");
          });

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g")
          .attr("class", "arcs");

      g.append("path")
          .attr("class", "arrow");

      g.append("g")
          .attr("class", "links");

      g.append("g")
          .attr("class", "nodes");

      g.append("g")
          .attr("class", "nodeLabels")


      svg = svg.merge(svgEnter);

      // Create nodes and links
      processData();
      draw();
    });
  }

  function updateForce() {
    if (!data) return;

    // Constrain to radius
    var r = Math.min(width, height) / 2 - 70;

    data.species.forEach(function(d) {
      var dist = Math.sqrt(d.x * d.x + d.y * d.y);

      if (dist > r) {
        var scale = r / dist;
        d.x *= scale;
        d.y *= scale;
      }
    });

    svg.select(".links").selectAll("path")
        .attr("d", function(d) {
          var reduction = typeof(d.target.value) !== "undefined" ?
                          nodeRadiusScale(d.target.value) : 0;
          reduction += +d3.select(this).style("stroke-width").slice(0, -2) * 3 / 2;

          var middle = adjustDistance(d.target, d.middle, -reduction),
              target = adjustDistance(middle, d.target, reduction);

          return "M" + d.source.x + "," + d.source.y
               + "S" + middle.x + "," + middle.y
               + " " + target.x + "," + target.y;

          function adjustDistance(p1, p2, r) {
            var vx = p2.x - p1.x,
                vy = p2.y - p1.y,
                d = Math.sqrt(vx * vx + vy * vy);

            vx /= d;
            vy /= d;

            d -= r;

            return {
              x: p1.x + vx * d,
              y: p1.y + vy *d
            };
          }
        })
        .each(function(d, i) {
          var length = this.getTotalLength(),
              // Could get width from link width scale, but would need to make global
              width = +d3.select(this).style("stroke-width").slice(0, -2);

          // Make length shorter to match marker
          d3.select(this)
//              .style("stroke-dasharray", length - width * 1.5 + 1);
        });

    svg.select(".nodes").selectAll(".nodes > g")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

    svg.select(".nodeLabels").selectAll(".nodeLabels > text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y - nodeRadiusScale(d.value); });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height)
      .select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    // Draw the diagram
    drawArcs();
    drawNodes();
    drawNodeLabels();
    drawLinks();
    drawArrow();

    // Tooltips
    $(".nodes > g").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    $(".links > path").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function drawArcs() {
      // TODO: Move to global settings somewhere
      var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
          .domain(data.phases.map(function(d) { return d.name; }));

      // Arc generator
      // XXX: SVG width seem to be a bit wider than container width. Maybe an
      // issue with margins. Need to look into this.
      var radius = Math.min(width, height) / 2 - 20;
      var arcShape = d3.arc()
          .cornerRadius(3)
          .outerRadius(radius)
          .innerRadius(radius - 40);

      // Bind phase data for arcs
      var arc = svg.select(".arcs").selectAll(".arcs > g")
          .data(pie(data.phases));

      // Enter
      var arcEnter = arc.enter().append("g")
          .on("click", function(d, i) {
            dispatcher.call("selectPhase", this, d.data.name);
          })
          .on("mouseover", function() {
            d3.select(this).call(highlightPhase, true);
          })
          .on("mouseout", function(d) {
            if (d.data !== currentPhase) {
              d3.select(this).call(highlightPhase, false);
            }
          });

      arcEnter.append("path")
          .attr("d", arcShape)
          .style("fill", "white")
          .style("stroke", "white");

      arcEnter.append("text")
          .text(function(d) { return d.data.name; })
          .attr("transform", textTransform)
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("fill", "white")
          .style("stroke", "none")
          .style("pointer-events", "none");

      // Enter + update
      var arcUpdate = arcEnter.merge(arc);

      arcUpdate.select("path")
          .attr("d", arcShape)
          .style("fill", function(d) { return colorScale(d.data.name); })
          .style("stroke", "#999");

      arcUpdate.select("text")
          .style("fill", "black")
          .attr("transform", textTransform);

      // Exit
      arc.exit().remove();

      // Highlight
      svg.selectAll(".arcs > g").each(function(d) {
        d3.select(this).call(highlightPhase, d.data === currentPhase);
      });

      function textTransform(d) {
        var angle = midAngle(d.startAngle, d.endAngle);

        return "translate(" + arcShape.centroid(d) + ")" +
               "rotate(" + (angle > 0 && angle < 180 ? -90 : 90) + ")" +
               "rotate(" + angle + ")";
      }

      function midAngle(start, end) {
        return (start + end) / 2 * 180 / Math.PI - 90;
      }

      function highlightPhase(selection, highlight) {
        // XXX: Copied from PhaseMap
        function highlightColor(color) {
          var hcl = d3.hcl(color);
          hcl.c *= 2;

          return hcl;
        }

        selection.select("path")
            .style("fill", function(d) {
              return highlight ?
                     highlightColor(colorScale(d.data.name)) :
                     colorScale(d.data.name);
            })
            .style("stroke-width", highlight ? 2 : null);

        selection.select("text")
            .style("font-weight", highlight ? "bold" : null);
      }
    }

    function drawNodes() {
      // Set fixed position for phases
      // XXX: Radius copied from above
      var radius = Math.min(width, height) / 2 - 60;

      pie(data.phases).forEach(function(d, i) {
        var a = d.endAngle - Math.PI / 2 - piePadAngle;

        d.data.fx = radius * Math.cos(a);
        d.data.fy = radius * Math.sin(a);
      });

      // Drag behavior, based on:
      // http://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
      var drag = d3.drag()
          .on("start", function(d) {
            if (!d3.event.active) {
              force.alphaTarget(0.3).restart();
            }

            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", function(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;

            $(this).tooltip("show");
          })
          .on("end", function(d) {
            if (!d3.event.active) {
              force.alphaTarget(0).alpha(1).restart();
            }

            d.fx = null;
            d.fy = null;

            $(this).tooltip("hide");
          });

      // Nodes
      var maxValue = d3.max(data.species, function(d) { return d.max; });

      nodeRadiusScale
          .domain([0, maxValue]);

/*
      var nodeFillScale = d3.scaleLinear()
          .domain([0, maxValue])
          .range(["white", "black"]);
*/
      var node = svg.select(".nodes").selectAll(".nodes > g")
          .data(data.species);

      // Node enter
      var nodeEnter = node.enter().append("g")
          .attr("data-toggle", "tooltip")
          .call(drag);

      nodeEnter.append("circle")
          .style("fill", "#ccc")
          .style("stroke", "black");

      // Node update
      nodeEnter.merge(node)
          .attr("data-original-title", nodeTooltip)
        .select("circle")
          .attr("r", function(d) { return nodeRadiusScale(d.value); })
//          .style("fill", function(d) { return nodeFillScale(d.value); });

      // Node exit
      node.exit().remove();

      function nodeTooltip(d) {
        return d.name + ": " + d.value;
      }
    }

    function drawNodeLabels() {
      // Bind species data
      var label = svg.select(".nodeLabels").selectAll(".nodeLabels > text")
          .data(data.species);

      // Label enter
      var labelEnter = label.enter().append("text")
          .style("fill", "black")
          .attr("dy", "-.2em")
          .style("text-anchor", "middle")
          .style("pointer-events", "none");

      // Label update
      labelEnter.merge(label)
          .text(function(d) { return d.name; })
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y - nodeRadiusScale(d.value); });

      // Label exit
      label.exit().remove();
    }

    function drawLinks() {
//      var linkColorScale = d3.scaleSequential(d3ScaleChromatic.interpolateRdBu)
//          .domain([1, -1]);
      var linkColorScale = d3.scaleLinear()
          .domain([-1, 0, 1])
          .range(["#00d", "#ddd", "#d00"])

      var linkWidthScale = d3.scaleLinear()
          .domain([0, 1])
          .range([1, 8]);

      // Bind data for markers
      var marker = svg.select("defs").selectAll("marker")
          .data(biLinks);

      // Marker enter
      var markerEnter = marker.enter().append("marker")
          .attr("viewBox", "0 0 10 10")
          .attr("markerWidth", 3)
          .attr("markerHeight", 3)
          .attr("refX", 0)
          .attr("refY", 5)
          .attr("orient", "auto");

      markerEnter.append("path");

      // Marker update
      markerEnter.merge(marker)
          .attr("id", markerName)
        .select("path")
          .attr("d", function(d) {
            return d.value < 0 ?
                   "M 0 0 L 5 0 L 5 10 L 0 10 z" :
                   "M 0 0 L 5 5 L 0 10 z";
          })
          .style("fill", function(d) { return linkColorScale(d.value); });

      // Marker exit
      marker.exit().remove();

      // Bind data for links
      var link = svg.select(".links").selectAll(".links > path")
          .data(biLinks);

      // Link enter
      var linkEnter = link.enter().append("path")
          .attr("data-toggle", "tooltip");

      // Link update
      linkEnter.merge(link).sort(function(a, b) {
          return d3.descending(Math.abs(a.value), Math.abs(b.value));
        })
          .attr("data-original-title", linkTooltip)
          .style("fill", "none")
          .style("stroke", function(d) {
            return linkColorScale(d.value);
          })
          .style("stroke-width", function(d) {
            return linkWidthScale(Math.abs(d.value));
          })
          .style("stroke-linecap", "round")
          .style("marker-end", null)
          .style("marker-end", function(d) {
            return "url(#" + markerName(d) + ")";
          })
          .each(function(d, i) {
            var length = this.getTotalLength();

            d3.select(this)
//                .style("stroke-dasharray", length * 0.9);
          });

      // Link exit
      link.exit().remove();

      function linkTooltip(d) {
        return d.middle.name + ": " + d.value;
      }

      function markerName(d) {
        return "marker_" + d.middle.name;
      }
    }

    function drawArrow() {
      // XXX: Copied from above
      var r = Math.min(width, height) / 2 - 40;

      // Make sure we line up with the start of the first arc by grabbing the
      // x position from the arc path itself
      var arc = svg.select(".arcs").select("path").attr("d"),
          x = arc.substr(1, arc.indexOf(",") - 1);

      svg.select(".arrow")
          .attr("d", "M 0 -10 L 10 0 L 0 10 z")
          .attr("transform", "translate(" + x + "," + (-r) + ")")
          .attr("pointer-events", "none")
          .style("fill", "black")
          .style("fill-opacity", 0.25);
    }
  }

  function processData() {
    var distanceScale = d3.scaleLinear()
        .domain([0, 1])
        .range([100, 0]);

    var strengthScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 1]);

    var newNodes = data.phases.slice().concat(data.species).slice();

    links = [];
    biLinks = [];
    data.speciesPhaseMatrix.forEach(function(d, i) {
      d.forEach(function(e, j) {
        if (Math.abs(e) > 0) {
          var midNode = {
            name: data.species[i].name + "→" + data.phases[j].name
          };

          newNodes.push(midNode);

          links.push({
            source: data.species[i],
            target: midNode,
            value: e,
            forceValue: e
          });

          links.push({
            source: midNode,
            target: data.phases[j],
            value: e,
            forceValue: e
          });

          biLinks.push({
            source: data.species[i],
            middle: midNode,
            target: data.phases[j],
            value: e
          });
        }
      });
    });

    if (currentPhase !== null) {
      var index = data.phases.map(function(d) {
        return d.name;
      }).indexOf(currentPhase.name);

      if (index > -1) {
        data.speciesMatrices[index].forEach(function(d, i) {
          d.forEach(function(e, j) {
            if (Math.abs(e) > 0) {
              var midNode = {
                name: data.species[i].name + "→" + data.species[j].name
              };

              newNodes.push(midNode);

              links.push({
                source: data.species[i],
                target: midNode,
                value: e,
                forceValue: e
              });

              links.push({
                source: midNode,
                target: data.species[j],
                value: e,
                forceValue: e
              });

              biLinks.push({
                source: data.species[i],
                middle: midNode,
                target: data.species[j],
                value: e
              });
            }
          });
        });
      }
    }

    // Copy previous node position
    if (nodes) {
      newNodes.forEach(function(d) {
        nodes.forEach(function(e) {
          if (d.name === e.name) {
            d.x = e.x;
            d.y = e.y;
          }
        });
      });
    }

    nodes = newNodes;

    force.nodes(nodes);

    force.force("link").links(links)
        //.distance(function(d) {
        //  return distanceScale(Math.abs(d.value));
        //});
        .distance(Math.min(width, height) / 20)
        .strength(function(d) {
          return strengthScale(Math.abs(d.forceValue));
        });

    force.alpha(1);
    force.restart();
  }

  networkMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return networkMap;
  };

  networkMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return networkMap;
  };

  // For registering event callbacks
  networkMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? networkMap : value;
  };

  // Initialize event callbacks
  networkMap.selectPhase = function(_) {
    if (data) {
      var index = data.phases.map(function(d) { return d.name; }).indexOf(_);

      currentPhase = index !== -1 ? data.phases[index] : null;

      processData();
      draw();
    }

    return networkMap;
  };

  networkMap.selectSpecies = function(_) {
    return networkMap;
  };

  networkMap.on("selectPhase", networkMap.selectPhase);
  networkMap.on("selectSpecies", networkMap.selectSpecies);

  return networkMap;
}
