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
      currentPhase,

      // Layout
      markerSize = 15,

      // Scales
      phaseColorScale = d3.scaleOrdinal(),
      interactionColorScale = d3.scaleLinear(),
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
      svgEnter.append("defs");

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

    var yScale = d3.scaleBand()
        .domain(data.phases.map(function(d) {
          return d.name;
        }))
        .range([0, innerHeight()])
        .paddingInner(0.15);

    var phaseSpacing = yScale.step() - yScale.bandwidth(),
        phaseWidth = 20,
        transitionY = (yScale.bandwidth() + phaseSpacing / 2);

    // Draw the visualization
    processData();
    drawPhases();
    drawLinks();
    drawNodes();
    drawNodeLabels();

    // Update tooltips
    $(".linearNetworkMap .node").tooltip({
      container: "body",
      animation: false
    });

    $(".linearNetworkMap .link").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function highlightPhase(phase) {
      // Highlight this phase
      svg.select(".phases").selectAll(".phase").selectAll("rect")
          .style("stroke-width", function(d) {
            return d === phase ? 4 : 2;
          });
    }

    function highlightTransitions(phase) {
      if (phase) {
        var transitionLinks = links.filter(function(d) {
          return !d.source.species || !d.target.species;
        });

        highlight(transitionLinks);
      }
      else {
        highlight();
      }
    }

    function highlightSpecies(species) {
      if (species) {
        var speciesLinks = links.filter(function(d) {
          return d.source.species === species || d.target.species === species;
        });

        highlight(speciesLinks, species);
      }
      else {
        highlight();
      }
    }

    function highlightLink(link) {
      if (link) {
        var matchedLinks = links.filter(function(d) {
          return (d.source.species === link.source.species && d.target.species === link.target.species) ||
                 (d.source.species === link.target.species && d.target.species === link.source.species);
        });

        highlight(matchedLinks);
      }
      else {
        highlight();
      }
    }

    function highlight(links, highlightSpecies) {
      if (links) {
        var highlightNodes = nodes.filter(function(d) {
          return d.species === highlightSpecies;
        });

        var linkNodes = d3.merge(links.map(function(d) {
          return [d.source, d.target];
        })).concat(highlightNodes);

        var linkTransitions = linkNodes.filter(function(d) {
          return !d.species;
        }).map(function(d) {
          return d.name;
        });

        // Do highlighting
        svg.select(".nodes").selectAll(".node")
            .style("stroke-width", function(d) {
              return highlightNodes.indexOf(d) !== -1 ? 2 : null;
            })
            .style("fill-opacity", function(d) {
              return linkNodes.indexOf(d) === -1 ? 0.1 : null;
            })
            .style("stroke-opacity", function(d) {
              return linkNodes.indexOf(d) === -1 ? 0.1 : null;
            });

        svg.select(".nodeLabels").selectAll(".nodeLabel").selectAll("text")
            .style("font-weight", function(d) {
              return highlightNodes.indexOf(d) !== -1 ? "bold" : null;
            })
            .style("fill-opacity", function(d) {
              return linkNodes.indexOf(d) === -1 ? 0.1 : null;
            })
            .style("stroke-opacity", function(d) {
              return linkNodes.indexOf(d) === -1 ? 0.1 : null;
            });

        svg.select(".phases").selectAll(".transition")
            .style("stroke-width", function(d) {
              return linkTransitions.indexOf(d.name) !== -1 ? 2 : null;
            })

        svg.select(".links").selectAll(".link")
            .style("visibility", function(d) {
              return links.indexOf(d) === -1 ? "hidden" : null;
            });
      }
      else {
        // Clear highlighting
        svg.select(".nodes").selectAll(".node")
            .style("stroke-width", null)
            .style("fill-opacity", null)
            .style("stroke-opacity", null);

        svg.select(".nodeLabels").selectAll(".nodeLabel").selectAll("text")
            .style("font-weight", null)
            .style("fill-opacity", null)
            .style("stroke-opacity", null);

        svg.select(".phases").selectAll(".transition")
            .style("stroke-width", null);

        svg.select(".links").selectAll(".link")
            .style("visibility", null);
      }
    }

    function drawPhases() {
      // Bind phase data
      var phase = svg.select(".phases").selectAll(".phaseGroup")
          .data(data.phases);

      // Enter + update
      phase.enter().append("g")
          .attr("class", "phaseGroup")
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
            .style("fill-opacity", 0.4)
            .style("stroke-width", 2)
            .on("click", function(d, i) {
              dispatcher.call("selectPhase", this, d.name);
            })
            .on("mouseover", function(d) {
              highlightPhase(d);
            })
            .on("mouseout", function(d) {
              highlightPhase();
            });

        phaseEnter.append("text")
            .style("dominant-baseline", "middle")
            .style("font-size", "x-small")
            .style("text-anchor", "middle")
            .style("pointer-events", "none");

        // Enter + update
        var phaseUpdate = phaseEnter.merge(phase)
            .attr("transform", transform);

        phaseUpdate.select("rect")
            .style("fill", fill)
            .style("stroke", phaseColor)
            .attr("width", phaseWidth)
            .attr("height", yScale.bandwidth())
            .attr("rx", phaseWidth / 2)
            .attr("ry", phaseWidth / 2);

        // Label
        phaseUpdate.select("text")
            .text(d.name)
            .attr("x", phaseWidth / 2)
            .attr("y", yScale.bandwidth() / 2);

        // Draw transition background line
        var transitionBackground = g.selectAll(".transitionBackground")
            .data([d]);

        // Enter + update
        transitionBackground.enter().append("rect")
            .attr("class", "transitionBackground")
            .style("visibility", "hidden")
            .style("pointer-events", "all")
            .on("mouseover", function(d) {
              highlightTransitions(d);
            })
            .on("mouseout", function(d) {
              highlightTransitions();
            })
          .merge(transitionBackground)
            .attr("x", phaseWidth / 2)
            .attr("y", yScale.bandwidth())
            .attr("width", innerWidth() - phaseWidth)
            .attr("height", phaseSpacing);

        // Draw transition line
        var transition = g.selectAll(".transition")
            .data([d]);

        // Enter + update
        transition.enter().append("line")
            .attr("class", "transition")
            .style("stroke", "#999")
            .style("stroke-dasharray", "5 5")
            .style("pointer-events", "none")
          .merge(transition)
            .attr("x1", phaseWidth / 2)
            .attr("y1", transitionY)
            .attr("x2", innerWidth() - phaseWidth / 2)
            .attr("y2", transitionY);

        function phaseColor(d) {
          return phaseColorScale(d.name);
        }

        function fill(d) {
          return d.name === currentPhase ? phaseColor(d) : "white";
        }

        function transform(d, i) {
          return i === 0 ? null :
                 "translate(" + (innerWidth() - phaseWidth) + ",0)";
        }
      }
    }

    function drawNodes() {
      var node = svg.select(".nodes").selectAll(".node")
          .data(nodes);

      // Node enter + update
      node.enter().append("circle")
          .attr("class", "node")
//          .attr("data-toggle", "tooltip")
          .style("fill", "#ddd")
          .style("stroke", "black")
          .on("mouseover", function(d) {
            highlightSpecies(d.species);
          })
          .on("mouseout", function() {
            highlightSpecies();
          })
        .merge(node)
//          .attr("data-original-title", nodeTooltip)
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) {
            return nodeRadiusScale(d.species.value);
          });

      // Node exit
      node.exit().remove();

      function nodeTooltip(d) {
        var s = d.species,
            v = s.value > s.min ? Math.round(Math.pow(2, Math.abs(s.value))) : 0;
        if (s.value < 0 && s.value !== s.min && v !== 1) v = fraction(1, v)

        return d.name + ": " + v + "x";

        function fraction(n, d) {
          return n + "/" + d;
        }
      }
    }

    function drawNodeLabels() {
      // Vertical offset for text
      var dy = "-.5em";

      // Filter nodes by current phase
      var nodeLabels = nodes.filter(function(d) {
        return d.phase.name === currentPhase;
      });

      // Bind species data
      var label = svg.select(".nodeLabels").selectAll(".nodeLabel")
          .data(nodeLabels);

      // Label enter
      var labelEnter = label.enter().append("g")
          .attr("class", "nodeLabel")
          .style("text-anchor", "middle")
          .style("font-size", "small")
          .on("mouseover", function(d) {
            highlightSpecies(d.species);
          })
          .on("mouseout", function() {
            highlightSpecies();
          })

      labelEnter.append("text")
          .attr("class", "background")
          .attr("dy", dy)
          .style("fill", "white")
          .style("stroke", "white")
          .style("stroke-width", 2);

      labelEnter.append("text")
          .attr("class", "foreground")
          .attr("dy", dy)
          .style("fill", "black");

      // Label update
      var labelUpdate = labelEnter.merge(label)
          .attr("transform", function(d, i) {
            return "translate(" + d.x + "," + (d.y - nodeRadiusScale(d.species.value)) + ")";
          });

      labelUpdate.select(".background")
          .text(function(d) { return d.species.name; });

      labelUpdate.select(".foreground")
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
          .attr("markerWidth", markerSize)
          .attr("markerHeight", markerSize)
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
                   "M 0 0 L 4 0 L 4 10 L 0 10 z" :
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
          .on("mouseover", function(d) {
            highlightLink(d);
          })
          .on("mouseout", function() {
            highlightLink();
          })
        .merge(link).sort(function(a, b) {
            return d3.descending(Math.abs(a.value), Math.abs(b.value));
          })
          .attr("data-original-title", linkTooltip)
          .attr("d", linkPath)
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
        return d.source.name + "→" + d.target.name + ": " + toString(d.value);

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

      function linkPath(d) {
        // Calculate length reduction based on target node radius
        var reduction = d.target.species ? nodeRadiusScale(d.target.species.value) : 0;
//          reduction += +d3.select(this).style("stroke-width").slice(0, -2) * 3 / 2;
        reduction += d.value < 0 ? markerSize * 0.8 / 2 : markerSize / 2;

        // Get perpendicual vector
        var vx = d.target.x - d.source.x,
            vy = d.target.y - d.source.y,
            mag = Math.sqrt(vx * vx + vy * vy);

        vx /= mag;
        vy /= mag;

        var temp = vy;
        vy = -vx;
        vx = temp;

        // Offset middle of curve for species->species links
        var offset = d.target.species ? 0.25 : 0,
            x = (d.source.x + d.target.x) / 2,
            y =  (d.source.y + d.target.y) / 2,
            middle = {
              x: x + vx * mag * offset,
              y: y + vy * mag * offset
            };

        middle = adjustDistance(d.target, middle, -reduction);
        var target = adjustDistance(middle, d.target, reduction);

        return "M" + d.source.x + "," + d.source.y
             + "S" + middle.x + "," + middle.y
             + " " + target.x + "," + target.y;

        function adjustDistance(p1, p2, r) {
          var vx = p2.x - p1.x,
              vy = p2.y - p1.y,
              d = Math.sqrt(vx * vx + vy * vy);

          vx /= d;
          vy /= d;

          d -= r + 2;

          return {
            x: p1.x + vx * d,
            y: p1.y + vy *d
          };
        }
      }
    }

    function processData() {
      // Create a point scale to map each species node to a circle
      // Add a dummy species so the spacing is correct when wrapping around
      var angleScale = d3.scalePoint()
          .domain(data.species.map(function(d) { return d.name; }))
          .range([-Math.PI, 0]);

      var rx = data.species.length > 1 ? innerWidth() / 4 : 0,
          ry = yScale.bandwidth() / 2;

      // Create nodes per phase
      nodes = data.phases.map(function(phase, i) {
        var cx = innerWidth() / 2,
            cy = data.species.length > 2 ?
                 yScale(phase.name) + 3 * yScale.bandwidth() / 4 :
                 yScale(phase.name) + yScale.bandwidth() / 2;

        return data.species.map(function(species, j) {
          var value = data.speciesPhaseMatrix[j][i],
              theta = angleScale(species.name),
              x = cx + rx * Math.cos(theta),
              y = cy + ry * Math.sin(theta);

          return {
            name: species.name,
            phase: phase,
            species: species,
            value: value,
            x: x,
            y: y
          };
        });
      });

      links = [];

      data.speciesPhaseMatrix.forEach(function(d, i) {
        d.forEach(function(e, j) {
          if (Math.abs(e) > 0) {
            var phase = data.phases[j],
                node = nodes[j][i],
                x = node.x,
                y = yScale(phase.name) + transitionY;

            links.push({
              source: node,
              target: {
                name: phase.name,
                phase: phase,
                x: x,
                y: y
              },
              value: e,
              name: node.species.name + "→" + phase.name
            });
          }
        });
      });

      data.speciesMatrices.forEach(function(matrix, i) {
        matrix.forEach(function(d, j) {
          d.forEach(function(e, k) {
            if (Math.abs(e) > 0) {
              links.push({
                source: nodes[i][j],
                target: nodes[i][k],
                value: e,
                name: data.phases[i].name + ":" + data.species[j].name + "→" + data.species[k].name
              });
            }
          });
        });
      });

      links.sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });

      nodes = d3.merge(nodes);
/*
      // Filter out nodes with 0 value, and their links
      nodes = nodes.filter(function(d) {
        return d.species.value > d.species.min;
      });

      links = links.filter(function(d) {
        return (!d.source.species || d.source.species.value > d.source.species.min) &&
               (!d.target.species || d.target.species.value > d.target.species.min);
      });
*/
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

  linearNetworkMap.interactionColorScale = function(_) {
    if (!arguments.length) return interactionColorScale;
    interactionColorScale = _;
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

      currentPhase = index !== -1 ? _ : null;

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
