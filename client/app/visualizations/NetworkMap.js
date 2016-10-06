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
      currentPhase = null,

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
          .style("pointer-events", "all");

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g")
          .attr("class", "phases");

      g.append("g")
          .attr("class", "species");

      svg = svg.merge(svgEnter);

      draw();
    });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height)
      .select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    // Draw phases
    drawPhases();

    function drawPhases() {
      // Pie layout for arcs
      var pie = d3.pie()
          .value(function() { return 1; })
          .padAngle(0.04);

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
            dispatcher.call("selectPhase", this, "Select: " + d.data.name);
          })
          .on("mouseover", function() {
            d3.select(this).call(highlightPhase, true);
          })
          .on("mouseout", function(d) {
            if (d !== currentPhase) {
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
          .style("fill", "#ddd")
          .style("stroke", "black")
          .attr("d", arc);

      phaseMerge.select("text")
          .style("fill", "black")
          .attr("transform", textTransform);

      // Exit
      phaseMerge.exit().remove();

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
        selection.select("path")
            .style("stroke-width", highlight ? 2 : null);

        selection.select("text")
            .style("font-weigth", highlight ? "bold" : null);
      }
    }
  }

  networkMap.update = function() {
    doLayout();
    draw();
  };

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
    console.log(_);
    return networkMap;
  };

  networkMap.selectSpecies = function(_) {
    console.log(_);
    return networkMap;
  };

  networkMap.on("selectPhase", networkMap.selectPhase);
  networkMap.on("selectSpecies", networkMap.selectSpecies);

  return networkMap;
}
