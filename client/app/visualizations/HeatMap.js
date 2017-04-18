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
      activePhase,
      phaseOverlayOpacity,

      // Scales
      xScale = d3.scaleLinear(),
      yScale = d3.scaleBand(),
      colorScale = d3.scaleLinear()
          .range(["white", "black"]),
      heightScale = d3.scaleLinear(),
      phaseColorScale,

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch();

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
      g.append("g")
          .attr("class", "borders");

      g.append("g")
          .attr("class", "rows");

      g.append("g")
          .attr("class", "phaseRows");

      g.append("rect")
          .attr("class", "highlight")
          .style("shape-rendering", "crispEdges")
          .style("pointer-events", "none")
          .style("fill", "none")
          .style("stroke", "none")
          .style("stroke-width", 2);

      svg = svg.merge(svgEnter);

      draw();
    });
  }

  function draw() {
    // Set width and height
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    xScale
        .domain(timeExtent)
        .range([0, width]);

    yScale
        .domain(d3.range(data.length))
        .range([0, height]);

    heightScale
        .domain(dataExtent)
        //.range([0, yScale.bandwidth()]);
        .range([yScale.bandwidth(), yScale.bandwidth()]);

    colorScale
        .domain(dataExtent);

    // Draw the diagram
    drawBorders();
    drawHeatMap();
    drawPhases();

    function drawBorders() {
      // Borders
      var border = svg.select(".borders").selectAll(".border")
          .data(function(d) { return d; });

      border.enter().append("rect")
          .attr("class", "border")
          .style("shape-rendering", "crispEdges")
          .style("fill", "none")
          .style("stroke", "#ddd")
          .style("stroke-width", 4)
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
            .attr("data-original-title", function(d) { return d.value; })
            .style("fill", function(d) { return color(d, row, rowIndex); });

        // Exit
        cell.exit()//.transition()
            .style("fill", "white")
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
      }
    }

    function drawPhases() {
      // Phase data
      var phaseRow = svg.select(".phaseRows").selectAll(".phaseRow")
          .data(phases);

      phaseRow.enter().append("g")
          .attr("class", "phaseRow")
        .merge(phaseRow)
          .attr("transform", function(d, i) {
            return "translate(0," + yScale(i) + ")";
          })
          .each(drawRow);

      phaseRow.exit().remove();

      function drawRow(row, rowIndex) {
        // Bind phase data
        var phase = d3.select(this).selectAll(".phase")
            .data(function(d) { return d; });

        // Enter
        var phaseEnter = phase.enter().append("g")
            .attr("class", "phase")
            .style("pointer-events", "none")
            .style("fill", phaseColor)
            .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
            .style("fill-opacity", phaseOverlayOpacity)
            .style("stroke-opacity", phaseOverlayOpacity);

        phaseEnter.append("line")
            .attr("x1", x1)
            .attr("y1", yScale.bandwidth() / 2)
            .attr("x2", x2)
            .attr("y2", yScale.bandwidth() / 2)
            .style("fill", "none")
            .style("stroke", phaseColor)
            .style("stroke-width", strokeWidth)
            .style("stroke-dasharray", "5,5");

        phaseEnter.append("line")
            .attr("x1", x1)
            .attr("y1", yScale.bandwidth() / 2)
            .attr("x2", x2)
            .attr("y2", yScale.bandwidth() / 2)
            .style("fill", "none")
            .style("stroke", function (d) {
              return d3.color(phaseColor(d)).darker();
            })
            .style("stroke-width", strokeWidth)
            .style("stroke-dasharray", "5,5")
            .style("stroke-dashoffset", 5);

        phaseEnter.append("circle")
            .attr("cx", x1)
            .attr("cy", yScale.bandwidth() / 2)
            .attr("r", r)
            .attr("clip-path", "url(#clipLeft)");

        phaseEnter.append("circle")
            .attr("cx", x2)
            .attr("cy", yScale.bandwidth() / 2)
            .attr("r", r)
            .attr("clip-path", "url(#clipRight)");

        // Update
        var phaseUpdate = phaseEnter.merge(phase)
            .style("fill", phaseColor)
            .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
            .style("fill-opacity", phaseOverlayOpacity)
            .style("stroke-opacity", phaseOverlayOpacity);

        // XXX: This is ugly, should probably just bind data for lines above since there are two
        phaseUpdate.selectAll("line")
          .data(function(d) { return [d, d]; })
            .attr("x1", x1)
            .attr("y1", yScale.bandwidth() / 2)
            .attr("x2", x2)
            .attr("y2", yScale.bandwidth() / 2)
            .style("stroke-width", strokeWidth);

        // XXX: This is ugly, should probably just bind data for circles above since there are two
        phaseUpdate.selectAll("circle")
          .data(function(d) { return [d, d]; })
            .attr("cx", function(d, i) { return i === 0 ? x1(d) : x2(d); })
            .attr("cy", yScale.bandwidth() / 2)
            .attr("r", r);

        // Exit
        phase.exit().transition()
            .style("fill-opacity", 0)
            .style("stroke-opacity", 0)
            .remove();

        function x1(d) {
          return xScale(d.start);
        }

        function x2(d) {
          return xScale(d.stop);
        }

        function phaseColor(d) {
          return phaseColorScale(d.name);
        }

        function r(d) {
          return d.name === activePhase ? 5 : 3;
        };

        function strokeWidth(d) {
          return d.name === activePhase ? 3 : 1;
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

  heatMap.activePhase = function(_) {
    if (!arguments.length) return activePhase;
    activePhase = _;
    return heatMap;
  };

  heatMap.phaseOverlayOpacity = function(_) {
    if (!arguments.length) return phaseOverlayOpacity;
    phaseOverlayOpacity = _;
    return heatMap;
  };

  return heatMap;
}
