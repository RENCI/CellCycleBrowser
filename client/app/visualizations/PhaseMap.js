var d3 = require("d3");

var PhaseMap = {};

PhaseMap.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "PhaseMap")
      .attr("width", props.width)
      .attr("height", props.height);

  // Background
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("visibility", "hidden")
      .style("pointer-events", "all")
      .on("click", function() {
        state.selectTrajectory({
          id: null,
          phases: []
        });

        state.selectPhase("");
      });

  var g = svg.append("g");

  g.append("g")
      .attr("class", "rows");
  g.append("g")
      .attr("class", "borders");
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

  this.update(element, state);
};

PhaseMap.update = function(element, state) {
  var svg = d3.select(element).select(".PhaseMap");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state);

  this.draw(svg, layout, state);
};

PhaseMap.layout = function(svg, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var xScale = d3.scaleLinear()
      .domain(state.timeExtent)
      .range([0, width]);

  var yScale = d3.scaleBand()
      .domain(d3.range(state.data.length))
      .range([0, height]);

  return {
    xScale: xScale,
    yScale: yScale
  };
};

PhaseMap.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

PhaseMap.draw = function(svg, layout, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var g = svg.select("g")
      .datum(state.data);

  // Borders
  var border = g.select(".borders").selectAll(".border")
      .data(function(d) { return d; });

  border.enter().append("rect")
      .attr("class", "border")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 2)
    .merge(border).transition()
      .attr("x", function(d) { return layout.xScale(d[0].start); })
      .attr("y", function(d, i) { return layout.yScale(i); })
      .attr("width", function(d) {
        return layout.xScale(d[d.length -1].stop) - layout.xScale(d[0].start);
      })
      .attr("height", layout.yScale.bandwidth());

  // Rows
  var row = g.select(".rows").selectAll(".cellRow")
      .data(function(d) { return d; });

  row.enter().append("g")
      .attr("class", "cellRow")
    .merge(row)
      .attr("transform", function(d, i) {
        return "translate(0," + layout.yScale(i) + ")";
      })
      .each(cells);

  row.exit().remove();

  // Highlight border
  g.select(".highlight2")
      .style("stroke", "none");

  g.select(".borders").selectAll(".border")
    .filter(function(d, i) {
      console.log(state.activeIndex);
      return state.activeIndex === i.toString()
    })
    .each(function() {
      var border = d3.select(this);

      g.select(".highlight2")
          .attr("x", border.attr("x"))
          .attr("y", border.attr("y"))
          .attr("width", border.attr("width"))
          .attr("height", border.attr("height"))
          .style("stroke", "#999");
    });

  function cells(row, rowIndex) {
    function x(d) {
      return layout.xScale(d.start);
    }

    function w(d) {
      return layout.xScale(d.stop) - layout.xScale(d.start);
    }

    var format = d3.format(".1f");

    function label(d) {
      return d.name + ": " + format(d.stop - d.start) + "h";
    }

    // Bind cell data
    var cell = d3.select(this).selectAll(".cell")
        .data(function(d) { return d; });

    // Enter + update
    cell.enter().append("rect")
        .attr("class", "cell")
        .attr("x", x)
        .attr("width", w)
        .attr("height", layout.yScale.bandwidth())
        .attr("shape-rendering", "crispEdges")
        .attr("data-toggle", "tooltip")
        .attr("data-original-title", label)
        .style("stroke-width", 2)
        .on("mouseover", function(d, i) {
          var rect = d3.select(this);

          g.select(".highlight")
              .attr("x", rect.attr("x"))
              .attr("y", layout.yScale(rowIndex))
              .attr("width", rect.attr("width"))
              .attr("height", rect.attr("height"))
              .style("stroke", highlightColor(state.colorScale(d.name)));

          function highlightColor(color) {
            var hcl = d3.hcl(color);
            var l = hcl.l > 50 ? hcl.l - 25 : hcl.l + 25;

            return d3.hcl(0, 0, l);
          }
        })
        .on("mouseout", function() {
          // Remove border
          g.select(".highlight")
              .style("stroke", "none");
        })
        .on("click", function(d) {
          state.selectTrajectory({
            id: rowIndex.toString(),
            phases: d3.select(this.parentNode).datum()
          });

          state.selectPhase(d.name);
        })
      .merge(cell)
        .style("fill", function(d) {
          return state.activeIndex === rowIndex.toString() ||
                 state.activePhase === d.name ?
                 highlightColor(state.colorScale(d.name)) :
                 state.colorScale(d.name);
        })
      .transition()
        .attr("x", x)
        .attr("width", w)
        .attr("height", layout.yScale.bandwidth())
        .attr("data-original-title", label);

    // Exit
    cell.exit().transition()
        .style("fill", "white")
        .remove();
  }

  function highlightColor(color) {
    var hcl = d3.hcl(color);
    hcl.c *= 2;

    return hcl;
  }
};

module.exports = PhaseMap;
