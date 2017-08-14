var d3 = require("d3");

module.exports = function () {
      // Size
  var width = 200,
      height = 200,

      // Data
      data,
      dataExtent,
      timeExtent,
      phases,
      phaseOverlayOpacity,

      // Scales
      phaseColorScale = d3.scaleOrdinal(),

      // Start with empty selection
      svg = d3.select();

  function heatMap(selection) {
    selection.each(function(d) {
      data = d;

      // Create skeletal chart
      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "heatMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      // Defs section for clipping paths
      var defs = svgEnter.append("defs");

      defs.append("clipPath")
          .attr("id", "clipLeft")
          .attr("clipPathUnits", "objectBoundingBox")
        .append("rect")
          .attr("x", 0.5)
          .attr("y", -0.1)
          .attr("width", 0.6)
          .attr("height", 1.2);

      defs.append("clipPath")
          .attr("id", "clipRight")
          .attr("clipPathUnits", "objectBoundingBox")
        .append("rect")
          .attr("x", -0.1)
          .attr("y", -0.1)
          .attr("width", 0.6)
          .attr("height", 1.2);

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g").attr("class", "borders");
      g.append("g").attr("class", "rows");
      g.append("g").attr("class", "phaseRows");
      g.append("g").attr("class", "phaseLines");

      g.append("rect")
          .attr("class", "highlight")
          .style("shape-rendering", "crispEdges")
          .style("pointer-events", "none")
          .style("fill", "none")
          .style("stroke", "none")
          .style("stroke-width", 2);

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height);

    // Create scales
    var xScale = d3.scaleLinear()
        .domain(timeExtent)
        .range([0, width]);

    var yScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, height]);

    var heightScale = d3.scaleLinear()
        //.range([0, yScale.bandwidth()]);
        .range([yScale.bandwidth(), yScale.bandwidth()]);

    var colorScale = d3.scaleLinear()
        .range(["white", "black"]);

    // Draw the visualization
    drawBorders();
    drawHeatMap();
    drawPhaseLines();

    // Update toltips
    $(".heatMap .cell").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function drawBorders() {
      // Borders
      var border = svg.select(".borders").selectAll(".border")
          .data(function(d) { return d; });

      border.enter().append("rect")
          .attr("class", "border")
          .style("shape-rendering", "crispEdges")
          .style("fill", "none")
          .style("stroke", "#ccc")
          .style("stroke-width", 2)
        .merge(border)//.transition()
          .attr("x", function(d) { return xScale(d[0].start); })
          .attr("y", function(d, i) { return yScale(i); })
          .attr("width", function(d) {
            return xScale(d[d.length -1].stop) - xScale(d[0].start);
          })
          .attr("height", yScale.bandwidth());
    }

    function drawHeatMap() {
      // Rows
      var row = svg.select(".rows").selectAll(".row")
          .data(function(d) { return d; });

      row.enter().append("g")
          .attr("class", "row")
        .merge(row)
          .attr("transform", function(d, i) {
            return "translate(0," + yScale(i) + ")";
          })
          .each(cells);

      row.exit().remove();

      function cells(row, rowIndex) {
        heightScale.domain(dataExtent[rowIndex]);
        colorScale.domain(dataExtent[rowIndex]);

        // Bind cell data
        var cell = d3.select(this).selectAll(".cell")
            .data(function(d) { return d; });

        // Enter + update
        cell.enter().append("rect")
            .attr("class", "cell")
            .attr("shape-rendering", "crispEdges")
            .attr("data-toggle", "tooltip")
            .style("stroke-width", 2)
            .on("mouseover", function(d, i) {
              var rect = d3.select(this);

              svg.select(".highlight")
                  .attr("x", rect.attr("x"))
                  .attr("y", yScale(rowIndex))
                  .attr("width", rect.attr("width"))
                  .attr("height", rect.attr("height"))
                  .style("stroke", highlightColor(color(d, row, rowIndex)));

              function highlightColor(color) {
                var hcl = d3.hcl(color);
                var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

                return d3.hcl(0, 0, l);
              }
            })
            .on("mouseout", function() {
              // Remove border
              svg.select(".highlight")
                  .style("stroke", "none");
            })
          .merge(cell)//.transition()
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("data-original-title", function(d) {
              return toString(d.value);
            })
            .style("fill", function(d) { return color(d, row, rowIndex); });

        // Exit
        cell.exit()//.transition()
            //.style("fill", "white")
            .remove();

        function x(d) {
          return xScale(d.start);
        }

        function y(d) {
          return yScale.bandwidth() - heightScale(d.value);
        }

        function width(d) {
          return xScale(d.stop) - xScale(d.start);
        }

        function height(d) {
          return heightScale(d.value);
        }

        function color(d) {
          return colorScale(d.value);
        }

        function toString(d) {
          var s = d.toString();

          if (s.indexOf(".") !== -1) {
            s = d.toFixed(2);
          }

          return s;
        }
      }
    }

    function drawPhaseLines() {
      // Create an array per phase
      var phaseData = [];
      phases.forEach(function(row) {
        row.forEach(function(phase) {
          if (phaseData.indexOf(phase.name) === -1) {
            phaseData.push(phase.name);
          }
        });
      });

      phaseData = phaseData.map(function(d) {
        return {
          name: d,
          values: []
        };
      });

      // Fill in data per phase
      phaseData.forEach(function(d) {
        phases.forEach(function(row, i) {
          row.forEach(function(phase, j) {
            if (phase.name === d.name) {
              d.values.push({
                rowIndex: i,
                start: phase.start,
                stop: phase.stop
              });
            }
          });
        });
      });

      var lineShape = d3.line();
          //.curve(d3.curveCardinal.tension(0.9));
          //.curve(d3.curveCatmullRom.alpha(0.5));
          //.curve(d3.curveMonotoneY);

      // Bind phase data
      var phase = svg.select(".phaseLines").selectAll(".phase")
          .data(phaseData);

      phase.enter().append("g")
          .attr("class", "phase")
        .merge(phase)
          .each(drawPhase);

      phase.exit().remove();

      function drawPhase(phase) {
        var lineWidth = 2;

        // Generate two lines per phase
        function lineData(xKey) {
          return d3.merge(phase.values.map(function(d) {
            var xShift = xKey === "start" ? lineWidth / 2 : -lineWidth / 2;

            var x = xScale(d[xKey]) + xShift,
                y = yScale(d.rowIndex);

            return [[x, y], [x, y + yScale.bandwidth()]];
          }));
        }

        var startLine = lineData("start");
        var stopLine = lineData("stop");

        startLine.forEach(function(d, i, a) {
          if (i % 2 === 0 && i > 0) {
            var p = a[i - 1];

            if (d[0] < p[0]) {
              d[1] += lineWidth / 2;
              p[1] += lineWidth / 2;
            }
            else if (d[0] > p[0]) {
              d[1] -= lineWidth / 2;
              p[1] -= lineWidth / 2;
            }
          }
        });

        stopLine.forEach(function(d, i, a) {
          if (i % 2 === 0 && i > 0) {
            var p = a[i - 1];

            if (d[0] < p[0]) {
              d[1] -= lineWidth / 2;
              p[1] -= lineWidth / 2;
            }
            else if (d[0] > p[0]) {
              d[1] += lineWidth / 2;
              p[1] += lineWidth / 2;
            }
          }
        });

        // Bind line data
        var line = d3.select(this).selectAll(".line")
            .data([startLine, stopLine]);

        // Enter + update
        line.enter().append("path")
            .attr("class", "line")
            .style("fill", "none")
          .merge(line)
            .attr("d", lineShape)
            .style("stroke", phaseColor(phase))
            .style("stroke-width", lineWidth);

        function phaseColor(d) {
          return phaseColorScale(d.name);
        }
      }
    }
  }

  heatMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return heatMap;
  };

  heatMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return heatMap;
  };

  heatMap.dataExtent = function(_) {
    if (!arguments.length) return dataExtent;
    dataExtent = _;
    return heatMap;
  };

  heatMap.timeExtent = function(_) {
    if (!arguments.length) return timeExtent;
    timeExtent = _;
    return heatMap;
  };

  heatMap.phases = function(_) {
    if (!arguments.length) return phases;
    phases = _;
    return heatMap;
  };

  heatMap.phaseColorScale = function(_) {
    if (!arguments.length) return phaseColorScale;
    phaseColorScale = _;
    return heatMap;
  };

  heatMap.phaseOverlayOpacity = function(_) {
    if (!arguments.length) return phaseOverlayOpacity;
    phaseOverlayOpacity = _;
    return heatMap;
  };

  return heatMap;
}
