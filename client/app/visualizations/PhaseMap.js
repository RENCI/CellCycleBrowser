var d3 = require("d3");

module.exports = function () {
    // Size
  var width = 200,
      height = 200,

      // Data
      data,
      timeExtent,
      activeIndex = "",
      drawLabels = false,

      // Scales
      colorScale,

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectTrajectory");

  function phaseMap(selection) {
    selection.each(function(d) {
      data = d;

      // Create skeletal chart
      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "phaseMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g").attr("class", "rows");

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

    // Draw the visualization
    drawPhaseMap();

    // Update toltips
    $(".phaseMap .cell").tooltip({
      container: "body",
      placement: "auto top",
      animation: false
    });

    function drawPhaseMap() {
      var strokeWidth = 2;

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
        var rowSelected = activeIndex === rowIndex.toString();

        var format = d3.format(".1f");

        // Bind cell data
        var cell = d3.select(this).selectAll(".cell")
            .data(function(d) { return d; });

        // Enter + update
        cell.enter().append("rect")
            .attr("class", "cell")
            .attr("shape-rendering", "crispEdges")
            .attr("data-toggle", "tooltip")
            .style("stroke-width", strokeWidth)
          .merge(cell)
            .attr("x", x)
            .attr("y", strokeWidth / 2)
            .attr("width", width)
            .attr("height", yScale.bandwidth() - strokeWidth)
            .attr("data-original-title", label)
            .style("fill", function(d) {
              return rowSelected ? highlightColor(d, 0.4) : "white";
            })
            .style("stroke", function(d) {
              return colorScale(d.name);
            })
            .style("rx", yScale.bandwidth() / 4)
            .style("ry", yScale.bandwidth() / 4);
/*
            .on("mouseover", function() {
              var w = 1;

              d3.select(this.parentNode).selectAll(".cell")
                .attr("x", function(d) { return x(d) + w / 2; })
                .attr("y", strokeWidth / 2 + w / 2)
                .attr("width", function(d) { return Math.max(width(d) - w, 0); })
                .attr("height", yScale.bandwidth() - strokeWidth - w)
                .style("stroke-width", strokeWidth + w);
            })
            .on("mouseout", function () {
              d3.select(this.parentNode).selectAll(".cell")
                .attr("x", x)
                .attr("y", strokeWidth / 2)
                .attr("width", width)
                .attr("height", yScale.bandwidth() - strokeWidth)
                .style("stroke-width", strokeWidth);
            })
            .on("click", function() {
              var selected = activeIndex === rowIndex.toString();

              // Select or unselect
              dispatcher.call("selectTrajectory", this, selected ? null : rowIndex.toString());
            });
*/

        // Exit
        cell.exit().remove();

        if (drawLabels) {
          // Bind cell data
          var label = d3.select(this).selectAll(".phaseLabel")
              .data(function(d) { return d; });

          // Enter + update
          label.enter().append("text")
              .attr("class", "phaseLabel")
              .attr("alignment-baseline", "middle")
              .style("font-size", "x-small")
              .style("text-anchor", "middle")
              .style("pointer-events", "none")
            .merge(label)
              .text(function(d) { return d.name; })
              .attr("x", labelX)
              .attr("y", yScale.bandwidth() / 2);

          label.exit().remove();

          function labelX(d) {
            return xScale(d.start) + (xScale(d.stop) - xScale(d.start)) / 2;
          }
        }

        function x(d) {
          return xScale(d.start) + strokeWidth / 2;
        }

        function width(d) {
          return Math.max(xScale(d.stop) - xScale(d.start) - strokeWidth, 0);
        }

        function label(d) {
          return d.name + ": " + format(d.stop - d.start) + "h";
        }

        function highlightColor(d, x) {
          var highlightScale = d3.scaleLinear()
              .domain([0, 1])
              .range(["white", colorScale(d.name)]);

          return highlightScale(x);
        }
      }
    }
  }

  phaseMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return phaseMap;
  };

  phaseMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return phaseMap;
  };

  phaseMap.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return phaseMap;
  };

  phaseMap.timeExtent = function(_) {
    if (!arguments.length) return timeExtent;
    timeExtent = _;
    return phaseMap;
  };

  phaseMap.activeIndex = function(_) {
    if (!arguments.length) return activeIndex;
    activeIndex = _;
    return phaseMap;
  };

  phaseMap.drawLabels = function(_) {
    if (!arguments.length) return drawLabels;
    drawLabels = _;
    return phaseMap;
  };

  // For registering event callbacks
  phaseMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? phaseMap : value;
  };

  phaseMap.on("selectTrajectory", phaseMap.selectTrajectory);

  return phaseMap;
}
