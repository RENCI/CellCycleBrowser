var d3 = require("d3");

module.exports = function () {
    // Size
  var width = 200,
      height = 200,

      // Data
      data,
      timeExtent,
      activeIndex = "",
      activePhase = "",

      // Scales
      colorScale,

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectTrajectory", "selectPhase");

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

      // Background
      svgEnter.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .style("visibility", "hidden")
          .style("pointer-events", "all")
          .on("click", function() {
            // Clear selection
            dispatcher.call("selectTrajectory", this, {
              id: null,
              phases: []
            });

            dispatcher.call("selectPhase", this, "");
          });

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g").attr("class", "rows");
      g.append("g").attr("class", "borders");

      g.append("rect")
          .attr("class", "highlight")
          .style("shape-rendering", "crispEdges")
          .style("pointer-events", "none")
          .style("fill", "none")
          .style("stroke", "none")
          .style("stroke-width", 2);

      g.append("rect")
          .attr("class", "highlight2")
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

    // Draw the visualization
    drawBorders();
    drawPhaseMap();

    function drawBorders() {
      // Borders
      var border = svg.select(".borders").selectAll(".border")
          .data(function(d) { return d; });

      border.enter().append("rect")
          .attr("class", "border")
          .style("shape-rendering", "crispEdges")
          .style("fill", "none")
          .style("stroke", "#ddd")
          .style("stroke-width", 2)
        .merge(border).transition()
          .attr("x", function(d) { return xScale(d[0].start); })
          .attr("y", function(d, i) { return yScale(i); })
          .attr("width", function(d) {
            return xScale(d[d.length -1].stop) - xScale(d[0].start);
          })
          .attr("height", yScale.bandwidth());
    }

    function drawPhaseMap() {
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

      // Highlight border
      svg.select(".highlight2")
          .style("stroke", "none");

      svg.select(".borders").selectAll(".border")
        .filter(function(d, i) {
          return activeIndex === i.toString()
        })
        .each(function() {
          var border = d3.select(this);

          svg.select(".highlight2")
              .attr("x", border.attr("x"))
              .attr("y", border.attr("y"))
              .attr("width", border.attr("width"))
              .attr("height", border.attr("height"))
              .style("stroke", "#999");
        });

      function cells(row, rowIndex) {
        var format = d3.format(".1f");

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
                  .style("stroke", highlightColor(colorScale(d.name)));

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
            .on("click", function(d) {
              dispatcher.call("selectTrajectory", this, {
                id: rowIndex.toString(),
                phases: d3.select(this.parentNode).datum()
              });

              dispatcher.call("selectPhase", this, d.name);
            })
          .merge(cell)//.transition()
            .attr("x", x)
            .attr("width", width)
            .attr("height", yScale.bandwidth())
            .attr("data-original-title", label)
            .style("fill", function(d) {
              return activeIndex === rowIndex.toString() ||
                     activePhase === d.name ?
                     highlightColor(colorScale(d.name)) :
                     colorScale(d.name);
            });

        // Exit
        cell.exit()//.transition()
            //.style("fill", "white")
            .remove();


        function x(d) {
          return xScale(d.start);
        }

        function width(d) {
          return xScale(d.stop) - xScale(d.start);
        }

        function label(d) {
          return d.name + ": " + format(d.stop - d.start) + "h";
        }

        function highlightColor(color) {
          var hcl = d3.hcl(color);
          hcl.c *= 2;

          return hcl;
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

  phaseMap.activePhase = function(_) {
    if (!arguments.length) return activePhase;
    activePhase = _;
    return phaseMap;
  };

  // For registering event callbacks
  phaseMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? phaseMap : value;
  };

  phaseMap.on("selectTrajectory", phaseMap.selectTrajectory);
  phaseMap.on("selectPhase", phaseMap.selectPhase);

  return phaseMap;
}
