var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

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

      // Groups for layout
      g.append("g")
          .attr("class", "chords");

      g.append("g")
          .attr("class", "arcs");

      draw();
    });
  }

  function draw() {
    // Pie layout for phase and species arcs
    var pie = d3.pie()
        .value(function() { return 1; })
        .padAngle(0.04);

    // Arc generator for phase and species arcs
    // XXX: SVG width seem to be a bit wider than container width. Maybe an
    // issue with margins. Need to look into this.
    var radius = Math.min(width, height) / 2 - 20;
    var arc = d3.arc()
        .cornerRadius(3)
        .outerRadius(radius)
        .innerRadius(radius - 40);

    // Set width and height
    svg .attr("width", width)
        .attr("height", height)
      .select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    // Draw phases and species as arcs
    drawArcs(data.phases, -Math.PI / 2, Math.PI / 2, "phase", "selectPhase");
    drawArcs(data.species, 3 * Math.PI / 2, Math.PI / 2, "species", "selectSpecies");

    // Draw chords between phases and species
    drawChords("phase", data.speciesPhaseMatrix);
    drawChords("species", []);

    function drawArcs(arcData, startAngle, endAngle, className, eventType) {
        // Set pie layout
        pie .startAngle(startAngle)
            .endAngle(endAngle);

        // Bind arc data
        var arcGroup = svg.select(".arcs").selectAll("." + className)
            .data(pie(arcData));

        // Enter
        var arcGroupEnter = arcGroup.enter().append("g")
            .attr("class", className)
            .on("click", function(d, i) {
              if (className === "phase") {
                currentPhase = d;

                svg.select(".arcs").selectAll(".phase")
                    .call(highlightArc, false);

                d3.select(this)
                    .call(highlightArc, true);

                svg.select(".chords").selectAll(".phase")
                    .style("visibility", function(e) {
                      return e.target.data === d.data ? "visible" : "hidden";
                    });

                drawChords("species", data.speciesMatrices[i]);
              }
              else {
                currentPhase = null;

                svg.selectAll(".phase").call(highlightArc, false);

                svg.select(".chords").selectAll(".phase")
                    .style("visibility", "visible");

                drawChords("species", []);
              }

              dispatcher.call(eventType, this, "Select: " + d.data.name);
            })
            .on("mouseover", function() {
              d3.select(this).call(highlightArc, true);
            })
            .on("mouseout", function(d) {
              if (d !== currentPhase) {
                d3.select(this).call(highlightArc, false);
              }
            });

        arcGroupEnter.append("path")
            .attr("d", arc)
            .style("fill", "white")
            .style("stroke", "white");

        arcGroupEnter.append("text")
            .text(function(d) { return d.data.name; })
            .attr("class", "arcLabel")
            .attr("transform", textTransform)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("stroke", "none")
            .style("pointer-events", "none");

        // Enter + update
        var arcGroupMerge = arcGroupEnter.merge(arcGroup);

        arcGroupMerge.select("path")
            .style("fill", className === "phase" ? "#bbb" : "#eee")
            .style("stroke", "black")
            .attr("d", arc);

        arcGroupMerge.select("text")
            .style("fill", "black")
            .attr("transform", textTransform)

        // Exit
        arcGroup.exit().remove();

        function textTransform(d) {
          var angle = midAngle(d.startAngle, d.endAngle);

          return "translate(" + arc.centroid(d) + ")" +
                 "rotate(" + (angle > 0 ? -90 : 90) + ")" +
                 "rotate(" + angle + ")";
        }

        function highlightArc(selection, highlight) {
          selection.select("path")
              .style("stroke-width", highlight ? 2 : null);

          selection.select("text")
              .style("font-weigth", highlight ? "bold" : null);
        }
    }

    function drawChords(targetClass, matrix) {
      // XXX: Magic numbers
      var chordWidth = 0.2,
          radius = Math.min(width, height) / 2 - 60;

      var arcs = svg.select(".arcs");

      var sources = arcs.selectAll(".species").data(),
          targets = arcs.selectAll("." + targetClass).data()

      var sourceData = sources.map(endPoint),
          targetData = targets.map(endPoint);

      var widthScale = d3.scaleLinear()
          .domain([0, 1])
          .range([0, chordWidth]);

      // Create chord data
      var chords = [];
      if (matrix.length > 0) {
        sourceData.forEach(function(d, i) {
          targetData.forEach(function(e, j) {
            // Get value for this pair
            var v = matrix[i][j];

            // Return if zero value
            if (v === 0) return;

            var w = widthScale(Math.abs(v));

            var source = {
              startAngle: d.angle - w,
              endAngle: d.angle + w,
              data: sources[i].data
            };

            var target = {
              startAngle: e.angle - w,
              endAngle: e.angle + w,
              data: targets[j].data
            };

            chords.push({
              source: source,
              target: target,
              value: v
            });
          })
        });
      }

      chords.sort(function(a, b) {
        return d3.descending(Math.abs(a.value), Math.abs(b.value));
      });

      var colorScale = d3.scaleSequential(d3ScaleChromatic.interpolateRdBu)
          .domain([1, -1]);

      // Bind data
      var ribbon = svg.select(".chords").selectAll("." + targetClass)
          .data(chords);

      // Enter + update
      ribbon.enter().append("path")
          .attr("class", targetClass)
          .attr("d", d3.ribbon().radius(radius))
          .style("fill", "white")
          .style("stroke", "white")
        .merge(ribbon)
          .attr("d", d3.ribbon().radius(radius))
          .style("fill", function(d) {
            return colorScale(d.value);
          })
          .style("stroke", "#333");

      ribbon.exit().remove();

      function endPoint(d) {
        return {
          angle: (d.startAngle + d.endAngle) / 2
        };
      }
    }

    function midAngle(start, end) {
      return (start + end) / 2 * 180 / Math.PI - 90;
    }
  }

  chordMap.update = function() {
    doLayout();
    draw();
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
  chordMap.selectPhase = function(_) {
    console.log(_);
    return chordMap;
  };

  chordMap.selectSpecies = function(_) {
    console.log(_);
    return chordMap;
  };

  chordMap.on("selectPhase", chordMap.selectPhase);
  chordMap.on("selectSpecies", chordMap.selectSpecies);

  return chordMap;
}
