var d3 = require("d3");

module.exports = function() {
      // Size
  var margin = { top: 20, left: 20, bottom: 40, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return height - margin.top - margin.bottom; },

      // Data
      data,
      nodes,
      links,
      biLinks,

      // Layout
      nodeRadiusScale = d3.scaleLinear()
          .range([3, 7]);
      force = d3.forceSimulation()
          //.force("link", d3.forceLink())
          .force("x", d3.forceX(function(d) { return d.xPos; }).strength(1))
          .force("y", d3.forceY(function(d) { return d.yPos; }))
          .force("collide", d3.forceCollide(10))
          //.force("manyBody", d3.forceManyBody().strength(-1))
          .on("tick", updateForce),

      // Scales
      // TODO: Move color scales to global settings somewhere
      phaseColorScale = d3.scaleOrdinal(),
      interactionColorScale = d3.scaleLinear()
          .domain([-10, -Number.EPSILON, 0, Number.EPSILON, 10])
          .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]);

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectPhase", "selectSpecies");

  function linearNetworkMap(selection) {
    selection.each(function(d) {
      data = d;

      // Create skeletal chart
      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "linearNetworkMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      // Defs section for arrow markers
      var filter = svgEnter.append("defs");

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "phases");
      g.append("g").attr("class", "nodePaths");
      g.append("g").attr("class", "links");
      g.append("g").attr("class", "nodes");
      g.append("g").attr("class", "nodeLabels");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function updateForce() {
    if (!data) return;

    svg.select(".links").selectAll(".link")
        .attr("d", function(d) {
          console.log(d);

          var reduction = typeof(d.target.value) !== "undefined" ?
                          nodeRadiusScale(d.target.value) : 0;
//          reduction += +d3.select(this).style("stroke-width").slice(0, -2) * 3 / 2;
          // XXX: This is half of the marker size. Should make a variable.
          reduction += 10;

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

    svg.select(".nodes").selectAll(".node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y });
/*
    svg.select(".nodeLabels").selectAll(".nodeLabels > g")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + (d.y - nodeRadiusScale(d.value)) + ")";
        });
*/
  }

  function draw() {
    console.log(data);

    // Set width and height
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    var maxValue = d3.max(data.species, function(d) { return d.max; });

    nodeRadiusScale
        .domain([0, maxValue]);

    var maxRadius = nodeRadiusScale.range()[1];

    var yScale = d3.scaleBand()
        .domain(data.phases.map(function(d) {
          return d.name;
        }))
        .range([0, innerHeight()])
        .paddingInner(0.15);

    var phaseSpacing = yScale.step() - yScale.bandwidth(),
        phaseWidth = phaseSpacing / 2,
        axisY = (yScale.bandwidth() + phaseSpacing / 2);

    var xScale = d3.scaleLinear()
        .domain([-10, 10])
        .range([phaseWidth * 1.5 + maxRadius,
                innerWidth() - phaseWidth * 1.5 - maxRadius]);

    // Draw the visualization
    processData();
    drawPhases();
    drawLinks();
    drawNodes();
//    drawNodeLabels();

    // Update tooltips
    $(".linearNetworkMap .node").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    $(".linearNetworkMap .link").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function drawPhases() {
      // Bind phase data
      var phase = svg.select(".phases").selectAll(".phaseGroup")
          .data(data.phases);

      // Enter + update
      phase.enter().append("g")
          .attr("class", "phaseGroup")
          .on("click", function(d, i) {
            dispatcher.call("selectPhase", this, d.name);
          })
          .on("mouseover", function() {
            d3.select(this).call(highlightPhase, true);
          })
          .on("mouseout", function(d) {
            d3.select(this).call(highlightPhase, false);
          })
        .merge(phase)
          .attr("transform", function(d) {
            return "translate(0," + yScale(d.name) + ")";
          })
          .each(drawPhase);

      // Exit
      phase.exit().remove();

      function drawPhase(d, i) {
        var g = d3.select(this);

        // Bind phase data twice
        var phase = g.selectAll(".phase")
            .data([d, d]);

        // Enter
        var phaseEnter = phase.enter().append("g")
            .attr("class", "phase");

        phaseEnter.append("rect")
            .style("fill", fill)
            .style("stroke", "#999");

        phaseEnter.append("path")
            .style("fill", "#eee")
            .style("stroke", "#999");

        // Enter + update
        var phaseUpdate = phaseEnter.merge(phase)
            .attr("transform", transform);

        phaseUpdate.select("rect")
            .attr("width", phaseWidth)
            .attr("height", yScale.bandwidth())
            .attr("rx", phaseWidth / 2)
            .attr("ry", phaseWidth / 2);

        // Arrow
        var tw = phaseWidth,
            th = phaseSpacing / 2;

        var arrowPath =
            "M " + (-tw / 2) + " " + -th / 2 +
            " L " + 0 + " " + (th / 2) +
            " L " + (tw / 2) + " " + (-th / 2) +
            " z";

        var arrowTransform =
            "translate(" + (phaseWidth / 2) + "," + axisY + ")";

        phaseUpdate.select("path")
            .attr("d", arrowPath)
            .attr("transform", arrowTransform);

        // Draw axis line
        var axis = g.selectAll(".axis")
            .data([d]);

        // Enter + update
        axis.enter().append("line")
            .attr("class", "axis")
            .style("stroke", "#999")
            .style("stroke-dasharray", "5 5")
          .merge(axis)
            .attr("x1", xScale.range()[0])
            .attr("y1", axisY)
            .attr("x2", xScale.range()[1])
            .attr("y2", axisY);

        function fill(d) {
          return phaseColorScale(d.name);
        }

        function transform(d, i) {
          return i === 0 ? null :
                 "translate(" + (innerWidth() - phaseWidth) + ",0)";
        }
      }

      function highlightPhase(selection, highlight) {
        selection.select("rect")
            .style("stroke-width", highlight ? 2 : null);
      }
    }

    function drawNodes() {
      var node = svg.select(".nodes").selectAll(".node")
          .data(nodes.filter(function(d) { return d.visible; }));

      // Node enter + update
      node.enter().append("circle")
          .attr("class", "node")
          .attr("data-toggle", "tooltip")
          .style("stroke", "black")
//          .call(drag);
        .merge(node)
          .attr("data-original-title", nodeTooltip)
          .attr("r", function(d) { return nodeRadiusScale(d.species.value); })
          .style("fill", function(d) { return interactionColorScale(d.value); });

      // Node exit
      node.exit().remove();

      function nodeTooltip(d) {
        return d.species.name + ": " + d.species.value;
      }
    }

    function drawArrows() {
      // Bind phase data
      var arrow = svg.select(".arrows").selectAll(".arrow")
          .data(data.phases);

      // Enter + update
      arrow.enter().append("path")
          .attr("class", "arrow")
          .attr("pointer-events", "none")
          .style("fill", "#eee")
          .style("stroke", "#999")
        .merge(arrow)
//          .attr("d", "M 0 -10 L 10 0 L 0 10 z")
          .attr("d", "M -10 -15 L 10 0 L -10 15 z")
          .attr("transform", function(d) {
            return "translate(" + radius + ",0)rotate(90)";
          });

      // Exit
      arrow.exit().remove();
    }

    function drawNodeLabels() {
      // Bind species data
      var label = svg.select(".nodeLabels").selectAll(".nodeLabels > g")
          .data(data.species);

      // Label enter
      var labelEnter = label.enter().append("g")
          .style("pointer-events", "none");

      labelEnter.append("text")
          .attr("dy", "-.2em")
          .style("fill", "white")
          .style("stroke", "white")
          .style("stroke-width", 2)
          .style("text-anchor", "middle");

      labelEnter.append("text")
          .attr("dy", "-.2em")
          .style("fill", "black")
          .style("text-anchor", "middle");

      // Label update
      labelEnter.merge(label).selectAll("text")
          .text(function(d) { return d.name; });

      // Label exit
      label.exit().remove();
    }

    function drawLinks() {
      var linkWidthScale = d3.scaleLinear()
          .domain([0, 10])
          .range([1, 8]);

      // Bind data for markers
      var marker = svg.select("defs").selectAll("marker")
          .data(biLinks);

      // Marker enter
      var markerEnter = marker.enter().append("marker")
          .attr("viewBox", "0 0 10 10")
          .attr("markerWidth", 20)
          .attr("markerHeight", 20)
          .attr("refX", 0)
          .attr("refY", 5)
          .attr("orient", "auto")
          .attr("markerUnits", "userSpaceOnUse");

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
          .style("fill", function(d) { return interactionColorScale(d.value); });

      // Marker exit
      marker.exit().remove();

      // Bind data for links
      var link = svg.select(".links").selectAll(".link")
          .data(biLinks);

      // Link enter + update
      link.enter().append("path")
          .attr("class", "link")
          .attr("data-toggle", "tooltip")
        .merge(link).sort(function(a, b) {
            return d3.descending(Math.abs(a.value), Math.abs(b.value));
          })
          .attr("data-original-title", linkTooltip)
          .style("fill", "none")
          .style("stroke", function(d) {
            return interactionColorScale(d.value);
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

//            d3.select(this)
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

    function processData() {
      // Create new nodes
      var newNodes = data.phases.map(function(phase, i) {
        return data.species.map(function(species, j) {
          var value = data.speciesPhaseMatrix[j][i];
          var x = xScale(value);
          var y = yScale(phase.name) + axisY;

          return {
            name: species.name + "→" + phase.name,
            phase: phase,
            species: species,
            value: data.speciesPhaseMatrix[j][i],
            visible: true,
            xPos: x,
            yPos: y,
            fx: x,
            y: y
          };
        });
      });

      links = [];
      biLinks = [];
      data.speciesMatrices.forEach(function(matrix, i) {
        matrix.forEach(function(d, j) {
          d.forEach(function(e, k) {
            if (Math.abs(e) > 0) {
              var x = (newNodes[i][j].xPos + newNodes[i][k].xPos) / 2,
                  y = newNodes[i][j].yPos;

              var midNode = {
                name: data.phases[i].name + ":" + data.species[j].name + "→" + data.species[k].name,
                xPos: x,
                yPos: y,
                x: x,
                y: y
              };

              newNodes.push([midNode]);

              links.push({
                source: newNodes[i][j],
                target: midNode,
                value: e,
                forceValue: e
              });

              links.push({
                source: midNode,
                target: newNodes[i][k],
                value: e,
                forceValue: e
              });

              biLinks.push({
                source: newNodes[i][j],
                middle: midNode,
                target: newNodes[i][k],
                value: e
              });
            }
          });
        });
      });

      console.log(newNodes);

      newNodes = d3.merge(newNodes);

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

//      force.force("link").links(links);
          //.distance(function(d) {
          //  return distanceScale(Math.abs(d.value));
          //});
          //.distance(Math.min(width, height) / 20)
          //.strength(function(d) {
          //  return strengthScale(Math.abs(d.forceValue));
          //});

      force.alpha(1);
      force.restart();
    }
  }

  linearNetworkMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return linearNetworkMap;
  };

  linearNetworkMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return linearNetworkMap;
  };

  linearNetworkMap.phaseColorScale = function(_) {
    if (!arguments.length) return phaseColorScale;
    phaseColorScale = _;
    return linearNetworkMap;
  };

  // For registering event callbacks
  linearNetworkMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? linearNetworkMap : value;
  };

  // Initialize event callbacks
  linearNetworkMap.selectPhase = function(_) {
    if (data) {
      var index = data.phases.map(function(d) { return d.name; }).indexOf(_);

      currentPhase = index !== -1 ? data.phases[index] : null;

      draw();
    }

    return linearNetworkMap;
  };

  linearNetworkMap.selectSpecies = function(_) {
    return linearNetworkMap;
  };

  linearNetworkMap.on("selectPhase", linearNetworkMap.selectPhase);
  linearNetworkMap.on("selectSpecies", linearNetworkMap.selectSpecies);

  return linearNetworkMap;
}
