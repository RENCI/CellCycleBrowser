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
      currentPhase = null,

      // Layout
      pie = d3.pie()
          .value(function() { return 1; })
          .padAngle(0.04),
      force = d3.forceSimulation()
          .force("link", d3.forceLink())
          .force("x", d3.forceX(0).strength(0.02))
          .force("y", d3.forceY(0).strength(0.02))
          .force("collide", d3.forceCollide(10))
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
          .attr("class", "phases");

      g.append("g")
          .attr("class", "links");

      g.append("g")
          .attr("class", "species");


      svg = svg.merge(svgEnter);

      // Create nodes and links
      processData();
      draw();
    });
  }

  function updateForce() {
    svg.select(".links").selectAll("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    svg.select(".species").selectAll(".species > g")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height)
      .select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    // Draw phases and species
    drawPhases();
    drawSpecies();

    // Tooltips
    $(".species > g").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    $(".links > line").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function drawPhases() {
      // TODO: Move to global settings somewhere
      var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
          .domain(data.phases.map(function(d) { return d.name; }));

      // Arc generator
      // XXX: SVG width seem to be a bit wider than container width. Maybe an
      // issue with margins. Need to look into this.
      var radius = Math.min(width, height) / 2 - 20;
      var arc = d3.arc()
          .cornerRadius(3)
          .outerRadius(radius)
          .innerRadius(radius - 40);

      // Bind arc data
      var phase = svg.select(".phases").selectAll(".phases > g")
          .data(pie(data.phases));

      // Enter
      var phaseEnter = phase.enter().append("g")
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

      phaseEnter.append("path")
          .attr("d", arc)
          .style("fill", "white")
          .style("stroke", "white");

      phaseEnter.append("text")
          .text(function(d) { return d.data.name; })
          .attr("class", "phaseLabel")
          .attr("transform", textTransform)
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("fill", "white")
          .style("stroke", "none")
          .style("pointer-events", "none");

      // Enter + update
      var phaseMerge = phaseEnter.merge(phase);

      phaseMerge.select("path")
          .style("fill", function(d) { return colorScale(d.data.name); })
          .style("stroke", "#999")
          .attr("d", arc);

      phaseMerge.select("text")
          .style("fill", "black")
          .attr("transform", textTransform);

      // Exit
      phaseMerge.exit().remove();

      // Highlight
      svg.selectAll(".phases > g").each(function(d) {
        d3.select(this).call(highlightPhase, d.data === currentPhase);
      });

      function textTransform(d) {
        var angle = midAngle(d.startAngle, d.endAngle);

        return "translate(" + arc.centroid(d) + ")" +
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
            .style("font-weigth", highlight ? "bold" : null);
      }
    }

    function drawSpecies() {
      // Set fixed position for phases
      // XXX: Radius copied from above
      var radius = Math.min(width, height) / 2 - 60;

      data.phases.forEach(function(d, i) {
        var numPhases = data.phases.length;

        var a = i / numPhases * 2 * Math.PI - Math.PI / 2 + Math.PI / numPhases;

        d.fx = radius * Math.cos(a);
        d.fy = radius * Math.sin(a);

//        var a =
//        d.fx = radius * Math.cos(sa - Math.PI / 2),
//        d.fy = radius * Math.sin(sa - Math.PI / 2),
      });

      // Nodes
      var nodeFillScale = d3.scaleLinear()
          .domain([0, d3.max(data.species, function(d) { return d.value; }) ])
          .range(["white", "black"]);

      var node = svg.select(".species").selectAll(".species > g")
          .data(data.species);

      // Node enter
      var nodeEnter = node.enter().append("g")
          .attr("data-toggle", "tooltip");

      nodeEnter.append("circle")
          .attr("r", 5)
          .style("stroke", "black");

      nodeEnter.merge(node)
          .attr("data-original-title", nodeTooltip)
          .style("fill", function(d) { return nodeFillScale(d.value); });

      // Node exit
      node.exit().remove();

      // Node exit

      // Links
//      var linkColorScale = d3.scaleSequential(d3ScaleChromatic.interpolateRdBu)
//          .domain([1, -1]);
      var linkColorScale = d3.scaleLinear()
          .domain([-1, 0, 1])
          .range(["#00d", "#fff", "#d00"])

      var linkWidthScale = d3.scaleLinear()
          .domain([0, 1])
          .range([0, 8]);

      var link = svg.select(".links").selectAll(".links > line")
          .data(links);

      // Link enter
      var linkEnter = link.enter().append("line")
          .attr("data-toggle", "tooltip");

      linkEnter.merge(link)
          .attr("data-original-title", linkTooltip)
          .style("stroke", function(d) {
            return linkColorScale(d.value);
          })
          .style("stroke-width", function(d) {
            return linkWidthScale(Math.abs(d.value));
          });

      // Link exit
      link.exit().remove();

      function nodeTooltip(d) {
        return d.name + ": " + d.value;
      }

      function linkTooltip(d) {
        return d.source.name + "→" + d.target.name + ": " + d.value;
      }
    }
  }

  function processData() {
    var distanceScale = d3.scaleLinear()
        .domain([0, 1])
        .range([100, 0]);

    var strengthScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 1]);

    nodes = data.phases.slice().concat(data.species).slice();

    links = [];
    data.speciesPhaseMatrix.forEach(function(d, i) {
      d.forEach(function(e, j) {
        if (Math.abs(e) > 0) {
          links.push({
            source: data.species[i],
            target: data.phases[j],
            value: e,
            forceValue: e
          });
        }
      });
    });

    if (currentPhase !== null) {
      var index = data.phases.indexOf(currentPhase);

      // XXX: Probably need to move to setting current phase from phase name
      // when linking with other views
      if (index > -1) {
        data.speciesMatrices[index].forEach(function(d, i) {
          d.forEach(function(e, j) {
            if (Math.abs(e) > 0) {
              links.push({
                source: data.species[i],
                target: data.species[j],
                value: e,
                forceValue: e
              });
            }
          });
        });
      }
    }

    force.nodes(nodes);

    force.force("link").links(links)
        //.distance(function(d) {
        //  return distanceScale(Math.abs(d.value));
        //});
        .distance(10)
        .strength(function(d) {
          return strengthScale(Math.abs(d.forceValue));
        });

    force.alpha(1);
//    force.alphaDecay(0.001);
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
