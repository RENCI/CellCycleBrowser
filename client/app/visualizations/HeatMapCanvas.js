var d3 = require("d3");

module.exports = function () {
      // Size
  var width = 200,
      height = 200,

      // Data
      data,
      scaled,
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

      // Use highlight rectangle for tooltip anchor
      var anchor = d3.select(this).selectAll(".anchor")
          .data([data]);

      var anchorEnter = anchor.enter().append("div")
          .attr("class", "anchor")
          .style("position", "absolute")
          .style("pointer-events", "none")
          .style("border-style", "solid")
          .style("border-width", "2px")
          .style("visibility", "hidden");

      anchor = anchorEnter.merge(anchor);

      $(anchor.node()).tooltip({
        trigger: "manual",
        title: "SUP",
        animation: false
      });

      function showHighlight(cell) {
        anchor
            .style("visibility", "visible")
            .style("left", cell.x + "px")
            .style("top", cell.y + "px")
            .style("width", cell.width + "px")
            .style("height", cell.height + "px")
            .style("border-color", cell.highlightColor);

        $(anchor.node())
            .attr("data-original-title", cell.string)
            .tooltip("show");
      }

      function hideHighlight() {
        anchor.style("visibility", "hidden");

        $(anchor.node()).tooltip("hide");
      }

      // Create skeletal chart
      canvas = d3.select(this).selectAll("canvas")
          .data([data]);

      var canvasEnter = canvas.enter().append("canvas")
          .attr("class", "heatMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          })
          .on("mousemove", function() {
            var m = d3.mouse(this),
                x = m[0], y = m[1];

            // Find cell
            var cell = null;
            for (var i = 0; i < scaled.length; i++) {
              var row = scaled[i],
                  y1 = row[0].y,
                  y2 = y1 + row[0].height;

              if (y >= y1 && y <= y2) {
                for (var j = 0; j < row.length; j++) {
                  var c = row[j],
                      x1 = c.x,
                      x2 = x1 + c.width;

                  if (x >= x1 && x <= x2) {
                    cell = c;
                    break;
                  }
                }

                break;
              }
            }

            if (cell) {
              showHighlight(cell);
            }
            else {
              hideHighlight();
            }
          })
          .on("mouseout", hideHighlight);

      canvas = canvasEnter.merge(canvas);

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
    drawPhaseLines();

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
      scaled = data.map(function(row, i) {
        heightScale.domain(dataExtent[i]);
        colorScale.domain(dataExtent[i]);

        var rowY = yScale(i);

        return row.map(function(d) {
          return {
            x: x(d),
            y: rowY + y(d),
            width: width(d),
            height: height(d),
            value: d.value,
            color: color(d),
            highlightColor: highlightColor(d),
            string: toString(d.value)
          };
        });
      });

      scaled.forEach(function(row, i) {
        colorScale.domain(dataExtent[i]);

        row.forEach(function(d) {
          context.beginPath();
          context.rect(d.x, d.y, d.width, d.height);
          context.fillStyle = d.color;
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

      function highlightColor(d) {
        var hcl = d3.hcl(colorScale(d.value));
        var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

        return d3.hcl(0, 0, l);
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
      var lineWidth = 2;

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

      context.lineWidth = lineWidth;

      phaseData.forEach(drawPhase);

      function drawPhase(phase) {
        context.strokeStyle = phaseColorScale(phase.name);

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

        drawLine(startLine);
        drawLine(stopLine);

        function drawLine(d) {
          context.beginPath();
          context.moveTo(d[0][0], d[0][1]);

          for (var i = 1; i < d.length; i++) {
            context.lineTo(d[i][0], d[i][1]);
          }

          context.stroke();
          context.closePath();
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
