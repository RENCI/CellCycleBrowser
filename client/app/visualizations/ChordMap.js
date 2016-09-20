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
      currentArc = null,

      // Layout
      arrow = ribbonArrow()
          .arrowHeight(1)
          .arrowWidth(1),

      arrowOverlay = ribbonArrowOverlay(),

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

      svgEnter.append("defs");

      svgEnter.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .style("visibility", "hidden")
          .style("pointer-events", "all");

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g")
          .attr("class", "arcs");

      g.append("g")
          .attr("class", "chords");

      svg = svg.merge(svgEnter);

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

    // Set callback for background rect
    svg.select("rect")
        .on("click", function() {
          currentArc = null;

          svg.selectAll(".arcs > g").call(highlightArc, false);

          svg.select(".chords").selectAll(".phase")
              .style("visibility", "visible");

          drawChords("species", []);
        });

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
                currentArc = d;

                svg.select(".arcs").selectAll(".arcs > g")
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
                currentArc = d;

                svg.select(".arcs").selectAll(".arcs > g")
                    .call(highlightArc, false);

                d3.select(this)
                    .call(highlightArc, true);

                svg.select(".chords").selectAll(".phase")
                    .style("visibility", function(e) {
                      return e.source.data === d.data ? "visible" : "hidden";
                    });

                drawChords("species", []);
              }

              dispatcher.call(eventType, this, "Select: " + d.data.name);
            })
            .on("mouseover", function() {
              d3.select(this).call(highlightArc, true);
            })
            .on("mouseout", function(d) {
              if (d !== currentArc) {
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
            .attr("transform", textTransform);

        // Exit
        arcGroup.exit().remove();

        function textTransform(d) {
          var angle = midAngle(d.startAngle, d.endAngle);

          return "translate(" + arc.centroid(d) + ")" +
                 "rotate(" + (angle > 0 ? -90 : 90) + ")" +
                 "rotate(" + angle + ")";
        }
    }

    function drawChords(targetClass, matrix) {
      // XXX: Magic numbers
      var chordWidth = 0.2,
          radius = Math.min(width, height) / 2 - 60;

      var arcs = svg.select(".arcs");

      var sources = arcs.selectAll(".species").data(),
          targets = arcs.selectAll("." + targetClass).data();
/*
      var sourceData = sources.map(endPoint),
          targetData = targets.map(endPoint);
*/
      var widthScale = d3.scaleLinear()
          .domain([0, 1])
          .range([0, chordWidth]);

      var colorScale = d3.scaleSequential(d3ScaleChromatic.interpolateRdBu)
          .domain([1, -1]);

      // Create chord data
      var chords = [];
      if (matrix.length > 0) {
        sources.forEach(function(d, i) {
          targets.forEach(function(e, j) {
            var saDiff = Math.abs(d.endAngle - d.startAngle),
                taDiff = Math.abs(e.endAngle - e.startAngle),
                arcData = arcs.selectAll(".arcs > g").data().sort(function(a, b) {
                  return d3.ascending(a.startAngle, b.startAngle);
                }),
                n = arcData.length - 1,
                saStep = (saDiff - chordWidth * 2 - d.padAngle * 2) / (n - 1),
                taStep = (taDiff - chordWidth * 2 - e.padAngle * 2) / (n - 1),
                sIndex = arcData.indexOf(d),
                tIndex = arcData.indexOf(e);

            function bucket(a, b, n) {
              return a - b > 0 ? a - b - 1 : n + (a - b);
            }

            var sBucket = bucket(sIndex, tIndex, n),
                tBucket = bucket(tIndex, sIndex, n);

            var sa = Math.min(d.startAngle, d.endAngle),
                ta = Math.min(e.startAngle, e.endAngle);

            sa += chordWidth + d.padAngle + saStep * sBucket,
            ta += chordWidth + e.padAngle + taStep * tBucket;

            if (targetClass === "species" &&
                matrix[i][j] !== 0 &&
                matrix[j][i] !== 0) {
              if (i >= j) return;

              // Get values for this pair
              var v1 = matrix[i][j],
                  v2 = matrix[j][i];

              var w1 = widthScale(Math.abs(v1)),
                  w2 = widthScale(Math.abs(v2));

              var source = {
                startAngle: sa - w2,
                endAngle: sa + w2,
                leftArrow: true,
                rightArrow: true,
                data: sources[i].data
              };

              var target = {
                startAngle: ta - w1,
                endAngle: ta + w1,
                leftArrow: true,
                rightArrow: true,
                data: targets[j].data
              };

              var chord = {
                source: source,
                target: target,
                doubleEnded: true,
                value: [v1, v2]
              };

              chords.push(chord);

              var sx = radius * Math.cos(sa - Math.PI / 2),
                  sy = radius * Math.sin(sa - Math.PI / 2),
                  tx = radius * Math.cos(ta - Math.PI / 2),
                  ty = radius * Math.sin(ta - Math.PI / 2),
                  x = tx - sx,
                  y = ty - sy,
                  length = Math.sqrt(x * x + y * y);

              x /= length,
              y /= length;

              // XXX: Move below code to operate on array of species-species ribbons
              var gradient = svg.select("defs").selectAll("#" + gradientId(chord))
                  .data([chord]);

              var gradientEnter = gradient.enter().append("linearGradient")
                  .attr("id", gradientId(chord));

              gradientEnter.selectAll("stop")
                  .data([v2, v1])
                .enter().append("stop")
                  .attr("offset", function(d, i) { return i; });

              gradientEnter.merge(gradient)
                  .attr("x1", 0)
                  .attr("y1", 0)
                  .attr("x2", x)
                  .attr("y2", y)
                .selectAll("stop")
                  .data([v2, v1])
                  .attr("stop-color", function(d) {
                    return colorScale(d);
                  });

/*
              // Get value for this pair
              var v = matrix[i][j];

              // Return if zero value
              if (v === 0) return;

              var w = widthScale(Math.abs(v));

              var source = {
                startAngle: sa,
                endAngle: sa + 2 * w,
                leftArrow: false,
                rightArrow: false,
                data: sources[i].data
              };

              var target = {
                startAngle: ta - 2 * w,
                endAngle: ta,
                leftArrow: true,
                rightArrow: true,
                data: targets[j].data
              };

              chords.push({
                source: source,
                target: target,
                value: v
              });
*/
            }
            else {
              // Get value for this pair
              var v = matrix[i][j];

              // Return if zero value
              if (v === 0) return;

              var w = widthScale(Math.abs(v));

              var source = {
                startAngle: sa - w,
                endAngle: sa + w,
                leftArrow: false,
                rightArrow: false,
                data: sources[i].data
              };

              var target = {
                startAngle: ta - w,
                endAngle: ta + w,
                leftArrow: true,
                rightArrow: true,
                data: targets[j].data
              };

              chords.push({
                source: source,
                target: target,
                doubleEnded: false,
                value: v
              });
            }
          });
        });
      }

      function chordCompare(a, b) {
        var va = a.value.length ?
                 (Math.abs(a.value[0]) + Math.abs(a.value[1])) / 2 :
                 Math.abs(a.value);
            vb = b.value.length ?
                 (Math.abs(b.value[0]) + Math.abs(b.value[1])) / 2 :
                 Math.abs(b.value);

        return d3.descending(va, vb);
      }

      chords.sort(chordCompare);

      arrow.radius(radius);
      arrowOverlay.radius(radius);

      var centerLine = ribbonCenterLine().radius(radius);

      // Bind data
      var ribbon = svg.select(".chords").selectAll("." + targetClass)
          .data(chords);

      // Enter + update
      var ribbonEnter = ribbon.enter().append("g")
          .attr("class", targetClass)
          .on("mouseover", function(d) {
            // Highlight ribbon
            d3.select(this).select(".ribbon")
                .style("stroke-width", 2);

            // Enable tooltip
            var tool = d3.select(this).select(".tooltipPosition").node();

            $(tool).tooltip({
              container: "body",
              placement: "auto top",
              animation: false,
              trigger: "manual",
              html: true
            })
            .tooltip("fixTitle")
            .tooltip("show");

            // Turn off mouse events for tooltip
            d3.select(".tooltip").style("pointer-events", "none");

            // Sort selection
            svg.select(".chords").selectAll(".chords > g")
                .sort(function(a, b) {
                  var aScore = bScore = 0;
                  if (a.source.data === d.source.data ||
                      a.source.data === d.target.data) aScore++;
                  if (a.target.data === d.source.data ||
                      a.target.data === d.target.data) aScore++;
                  if (b.source.data === d.source.data ||
                      b.source.data === d.target.data) bScore++;
                  if (b.target.data === d.source.data ||
                      b.target.data === d.target.data) bScore++;

                  return aScore === bScore ?
                         chordCompare(a, b) :
                         d3.ascending(aScore, bScore);
                })
                .order();
          })
        .on("mouseout", function(d) {
          // Reset ribbon highlight
          d3.select(this).select(".ribbon").style("stroke-width", null);

          // Remove tooltip
          var tool = d3.select(this).select(".tooltipPosition").node();

          $(tool).tooltip('hide');

          // Sort selection
          svg.select(".chords").selectAll(".chords > g")
              .sort(chordCompare)
              .order();
        });

      ribbonEnter.append("path")
          .attr("class", "ribbon")
          .attr("d", arrow)
          .style("fill", "white")
          .style("stroke", "white");

      ribbonEnter.append("path")
          .attr("class", "ribbonOverlay")
          .attr("d", arrowOverlay)
          .style("fill", "white")
          .style("fill-opacity", 0.2)
          .style("pointer-events", "none");

      ribbonEnter.append("path")
          .attr("class", "centerLine")
          .attr("d", centerLine)
          .style("visibility", "hidden")
          .style("pointer-events", "none");

      ribbonEnter.append("g")
          .attr("class", "tooltipPosition")
          .attr("transform", function() {
            var center = d3.select(this.parentNode).select(".centerLine").node(),
                mid = center.getPointAtLength(center.getTotalLength() * 0.5);

            return "translate(" + mid.x + "," + mid.y + ")";
          })
          .attr("data-toggle", "tooltip")
          .attr("title", titleText);

      // Enter + update
      var ribbonMerge = ribbonEnter.merge(ribbon);

      ribbonMerge.select(".ribbon")
          .attr("d", arrow)
          .style("fill", function(d) {
            return d.value.length ?
                   "url(#" + gradientId(d) + ")" :
                   colorScale(d.value);
          })
          .style("stroke", "#333");

      ribbonMerge.select(".ribbonOverlay")
          .attr("d", arrowOverlay)
          .style("fill", "black");
          //.style("stroke", "black")
          //.style("stroke-width", 1)
          //.style("stroke-opacity", 0.5);

      ribbonMerge.select(".centerLine")
          .attr("d", centerLine);

      ribbonMerge.select(".tooltipPosition")
          .attr("transform", function() {
            var center = d3.select(this.parentNode).select(".centerLine").node(),
                mid = center.getPointAtLength(center.getTotalLength() * 0.5);

            return "translate(" + mid.x + "," + mid.y + ")";
          })
          .attr("title", titleText);

      // Exit
      ribbon.exit().remove();

      // Sort selection
      svg.select(".chords").selectAll(".chords > g")
          .sort(chordCompare)
          .order();

      function endPoint(d) {
        return {
          angle: (d.startAngle + d.endAngle) / 2
        };
      }

      function titleText(d) {
        if (d.value.length) {
          return d.source.data.name + " &#8594 " +
                 d.target.data.name + ": " + d.value[0] + "<br>" +
                 d.target.data.name + " &#8594 " +
                 d.source.data.name + ": " + d.value[1];
        }
        else {
          return d.source.data.name + " &#8594 " +
                 d.target.data.name + ": " + d.value;
        }
      }

      function gradientId(chord) {
        return "gradient_" +
               chord.source.data.name + "_" +
               chord.target.data.name;
      }
    }

    function midAngle(start, end) {
      return (start + end) / 2 * 180 / Math.PI - 90;
    }

    function highlightArc(selection, highlight) {
      selection.select("path")
          .style("stroke-width", highlight ? 2 : null);

      selection.select("text")
          .style("font-weigth", highlight ? "bold" : null);
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
