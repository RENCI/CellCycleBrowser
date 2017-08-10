var d3 = require("d3");

module.exports = function() {
      // Size
  var margin = { top: 20, left: 20, bottom: 30, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return height - margin.top - margin.bottom; },

      // Data
      data,
      nodes,
      links,

      // Layout
      // XXX: Would be nice to use a separate simualtion for each phases,
      // but it seems that only one simulation can be active at a time
      nodePathLine = d3.line()
          .curve(d3.curveCardinal)
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; }),

      // Scales
      // TODO: Move color scales to global settings somewhere
      phaseColorScale = d3.scaleOrdinal(),
      interactionColorScale = d3.scaleLinear()
          .domain([-10, -Number.EPSILON, 0, Number.EPSILON, 10])
          .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]),
      nodeRadiusScale = d3.scaleLinear()
          .range([1, 12]),

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
      g.append("g").attr("class", "links");
      g.append("g").attr("class", "nodes");
      g.append("g").attr("class", "nodeLabels");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    var minValue = d3.min(data.species, function(d) {
      return d.min;
    });
    var maxValue = d3.max(data.species, function(d) {
      return d.max;
    });

    nodeRadiusScale
        .domain([minValue, maxValue]);

    var maxRadius = nodeRadiusScale.range()[1];

    var yScale = d3.scaleBand()
        .domain(data.phases.map(function(d) {
          return d.name;
        }))
        .range([0, innerHeight()])
        .paddingInner(0.15);

    var phaseSpacing = yScale.step() - yScale.bandwidth(),
        phaseWidth = 20,
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
/*
    $(".linearNetworkMap .node").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });
*/
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

      function drawPhase(d) {
        var g = d3.select(this);

        // Bind phase data twice
        var phase = g.selectAll(".phase")
            .data([d, d]);

        // Enter
        var phaseEnter = phase.enter().append("g")
            .attr("class", "phase");

        phaseEnter.append("rect")
            .style("fill", "none")
            .style("stroke", phaseColor)
            .style("stroke-width", 2);

        phaseEnter.append("text")
            .attr("alignment-baseline", "middle")
            .style("fill", "black")
            .style("font-size", "x-small")
            .style("text-anchor", "middle");

        // Enter + update
        var phaseUpdate = phaseEnter.merge(phase)
            .attr("transform", transform);

        phaseUpdate.select("rect")
            .attr("width", phaseWidth)
            .attr("height", yScale.bandwidth())
            .attr("rx", phaseWidth / 2)
            .attr("ry", phaseWidth / 2);

        // Label
        phaseUpdate.select("text")
            .text(d.name)
            .attr("x", phaseWidth / 2)
            .attr("y", yScale.bandwidth() / 2);

        // Draw axis line
        var axis = g.selectAll(".axis")
            .data([d]);

        // Enter + update
        axis.enter().append("line")
            .attr("class", "axis")
            .style("stroke", "#999")
            .style("stroke-dasharray", "5 5")
          .merge(axis)
            .attr("x1", phaseWidth)
            .attr("y1", axisY)
            .attr("x2", innerWidth() - phaseWidth)
            .attr("y2", axisY);

        function phaseColor(d) {
          return phaseColorScale(d.name);
        }

        function transform(d, i) {
          return i === 0 ? null :
                 "translate(" + (innerWidth() - phaseWidth) + ",0)";
        }
      }

      function highlightPhase(selection, highlight) {
        selection.selectAll("rect")
            .style("stroke-width", highlight ? 2 : null);
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

    function drawNodes() {
      var node = svg.select(".nodes").selectAll(".node")
          .data(nodes.filter(function(d) { return d.visible; }));

      // Node enter + update
      node.enter().append("circle")
          .attr("class", "node")
//          .attr("data-toggle", "tooltip")
          .style("stroke", "black")
          .on("mouseover", function(d) {
            highlightSpecies(d.species);
          })
          .on("mouseout", function() {
            highlightSpecies();
          })
        .merge(node)
//          .attr("data-original-title", nodeTooltip)
          .attr("r", function(d) {
            return nodeRadiusScale(d.species.value);
          })
          .style("fill", function(d) {
            return interactionColorScale(d.value);
          });

      // Node exit
      node.exit().remove();

      function nodeTooltip(d) {
        return d.species.name + ": " + d.species.value;
      }
    }

    function highlightSpecies(species) {
      svg.select(".nodes").selectAll(".node")
          .style("stroke-width", function(d) {
            return d.species === species ? 2 : null;
          });

      svg.select(".nodePaths").selectAll(".nodePath")
          .style("stroke", species ? "#999" : "#eee")
          .style("visibility", function(d) {
            return !species ? null :
                   d[0].species === species ? "visible" : "hidden";
          });

      svg.select(".nodeLabels").selectAll(".nodeLabel")
          .style("font-weight", function(d) {
            return d.species === species ? "bold" : null;
          });
    }

    function drawNodePaths() {
      var nodePaths = d3.nest()
          .key(function(d) { return d.species.name; })
          .entries(nodes.filter(function(d) { return d.visible; }))
          .map(function(d) { return d.values; });

      // Add labels
      // XXX: Duplicating code from drawNodeLabels...
      var labelXScale = d3.scalePoint()
          .domain(d3.range(nodePaths.length))
          .range([0, innerWidth()])
          .padding(0.5);

      nodePaths.forEach(function(d, i) {
        d.unshift({
          species: d[0].species,
          x: labelXScale(i),
          y: yScale.bandwidth() / 2
        });
      });

      var nodePath = svg.select(".nodePaths").selectAll(".nodePath")
          .data(nodePaths);

      // NodePath enter + update
      nodePath.enter().append("path")
          .attr("class", "nodePath")
          .style("fill", "none")
          .style("stroke", "#eee")
          .style("stroke-width", function(d) {
            return nodeRadiusScale(d[0].species.value) / 2;
          })
          .style("stroke-linecap", "round")
        .merge(nodePath)
          .attr("d", nodePathLine);

      // Node exit
      nodePath.exit().remove();
    }

    function drawNodeLabels() {
      var nodeLabels = nodes.filter(function(d) {
        return d.phase === data.phases[0];
      });

      var labelXScale = d3.scalePoint()
          .domain(d3.range(nodeLabels.length))
          .range([0, innerWidth()])
          .padding(0.5);

      // Bind species data
      var label = svg.select(".nodeLabels").selectAll(".nodeLabel")
          .data(nodeLabels);

      // Label enter
      var labelEnter = label.enter().append("g")
          .attr("class", "nodeLabel")
          .on("mouseover", function(d) {
            highlightSpecies(d.species);
          })
          .on("mouseout", function() {
            highlightSpecies();
          });

      labelEnter.append("text")
          .attr("dy", "-.5em")
          .style("fill", "white")
          .style("stroke", "white")
          .style("stroke-width", 2)
          .style("text-anchor", "middle");

      labelEnter.append("text")
          .attr("dy", "-.5em")
          .style("fill", "black")
          .style("text-anchor", "middle");

      // Label update
      labelEnter.merge(label)
          .attr("transform", function(d, i) {
            return "translate(" + labelXScale(i) + "," + yScale.bandwidth() / 2 + ")";
          })
        .selectAll("text")
          .text(function(d) { return d.species.name; });

      // Label exit
      label.exit().remove();
    }

    function drawLinks() {
      var linkWidthScale = d3.scaleLinear()
          .domain([0, 10])
          .range([1, 8]);

      // Bind data for markers
      var marker = svg.select("defs").selectAll("marker")
          .data(links);

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
          .data(links);

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
          });
/*
          .each(function(d, i) {
            var length = this.getTotalLength();

            d3.select(this)
                .style("stroke-dasharray", length * 0.9);
          });
*/

      // Link exit
      link.exit().remove();

      function linkTooltip(d) {
        return d.source.species.name + "→" +
               d.target.species.name + ": " +
               toString(d.value);

        function toString(d) {
          var s = d.toString();

          if (s.indexOf(".") !== -1) {
            s = d.toFixed(2);
          }

          return s;
        }
      }

      function markerName(d) {
        return "marker_" + d.name;
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
            fy: y + j * 100
          };
        });
      });

      // Create links
      links = [];
      data.speciesMatrices.forEach(function(matrix, i) {
        matrix.forEach(function(d, j) {
          d.forEach(function(e, k) {
            if (Math.abs(e) > 0) {
              var x = (newNodes[i][j].xPos + newNodes[i][k].xPos) / 2,
                  y = (newNodes[i][j].yPos + newNodes[i][k].yPos) / 2;

              links.push({
                source: newNodes[i][j],
                target: newNodes[i][k],
                value: e,
                name: data.phases[i].name + ":" + data.species[j].name + "→" + data.species[k].name,
                forceValue: e
              });
            }
          });
        });
      });

      links.sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });

      newNodes = d3.merge(newNodes);

      // Copy previous node position
      if (nodes) {
        newNodes.forEach(function(d) {
          nodes.forEach(function(e) {
            if (d.name === e.name) {
              d.x = e.x;
              d.y = e.y;
              d.fy = null;
            }
          });
        });
      }

      nodes = newNodes;
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
