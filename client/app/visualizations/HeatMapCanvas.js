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
      canvas = d3.select();

  function heatMap(selection) {
    selection.each(function(d) {
      data = d;

      // Create skeletal chart
      canvas = d3.select(this).selectAll("canvas")
          .data([data]);

      var canvasEnter = canvas.enter().append("canvas")
          .attr("class", "heatMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      canvas = canvasEnter.merge(canvas);
/*
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
*/
      draw();
    });
  }

  function draw() {
    // Set width and height
    canvas.attr("width", width)
          .attr("height", height);

    var context = canvas.node().getContext("2d");

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
//    drawPhaseLines();

    // Update tooltips
//    $(".heatMap .cell").tooltip();

    function drawBorders() {
      context.lineWidth = 2;

      data.forEach(function(row, i) {
        context.beginPath();
        context.rect(x(row), yScale(i), width(row), yScale.bandwidth());
        context.strokeStyle = "#ccc";
        context.stroke();
        context.closePath();
      });

      function x(d) {
        return xScale(d[0].start);
      }

      function y(i) {
        return yScale(i);
      }

      function width(d) {
        return xScale(d[d.length -1].stop) - xScale(d[0].start);
      }
    }

    function drawHeatMap() {
      data.forEach(function(row, i) {
        heightScale.domain(dataExtent[i]);
        colorScale.domain(dataExtent[i]);

        var rowY = yScale(i);

        row.forEach(function(d) {
          context.beginPath();
          context.rect(x(d), rowY + y(d), width(d), height(d));
          context.fillStyle = color(d);
          context.fill();
          context.closePath();
        });
      });

      function x(d) {
        return Math.floor(xScale(d.start));
      }

      function y(d) {
        return yScale.bandwidth() - heightScale(d.value);
      }

      function width(d) {
        return Math.ceil(xScale(d.stop) - xScale(d.start));
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
