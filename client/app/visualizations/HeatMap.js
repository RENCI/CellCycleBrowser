var d3 = require("d3");

var HeatMap = {};

HeatMap.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatMap")
      .attr("width", props.width)
      .attr("height", props.height);

  var defs = svg.append("defs");

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

  var g = svg.append("g");

  g.append("g")
      .attr("class", "borders")
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

  this.update(element, state);
};

HeatMap.update = function(element, state) {
  var svg = d3.select(element).select(".heatMap");
//      .attr("width", props.width)
//      .attr("height", props.height);

  // Filter invalid values
  state.data = state.data.map(function(d) {
    return d.filter(function(d) {
      return d.value >= 0;
    });
  });

  var layout = this.layout(svg, state);

  this.draw(svg, layout, state);
};

HeatMap.layout = function(svg, state) {
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

HeatMap.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

HeatMap.draw = function(svg, layout, state) {
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
      .style("stroke-width", 4)
    .merge(border)//.transition()
      .attr("x", function(d) { return layout.xScale(d[0].time + rowOffset(d)); })
      .attr("y", function(d, i) { return layout.yScale(i); })
      .attr("width", function(d) {
        return layout.xScale(d[d.length -1].time) - layout.xScale(d[0].time) + 10;
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

  function cells(row, rowIndex) {
    function x(d) {
      return layout.xScale(d.time + rowOffset(row));
    }

    // Bind cell data
    var cell = d3.select(this).selectAll(".cell")
        .data(function(d) { return d; });

    // Enter + update
    cell.enter().append("rect")
        .attr("class", "cell")
        .attr("x", x)
        .attr("width", 10)
        .attr("height", layout.yScale.bandwidth())
        .attr("shape-rendering", "crispEdges")
        .attr("data-toggle", "tooltip")
        .attr("data-original-title", function(d) { return d.value; })
        .style("fill", "white")
        .style("stroke-width", 2)
        .on("mouseover", function(d, i) {
          var rect = d3.select(this);

          g.select(".highlight")
              .attr("x", rect.attr("x"))
              .attr("y", layout.yScale(rowIndex))
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
          g.select(".highlight")
              .style("stroke", "none");
        })
      .merge(cell)//.transition()
        .attr("x", x)
        .attr("width", 10)
        .attr("height", layout.yScale.bandwidth())
        .attr("data-original-title", function(d) { return d.value; })
        .style("fill", function(d) { return color(d, row, rowIndex); });

    // Exit
    cell.exit().transition()
        .style("fill", "white")
        .remove();
  }

  // Phase data
  var phaseRow = g.select(".phaseRows").selectAll(".phaseRow")
          .data(state.phases);

  phaseRow.enter().append("g")
      .attr("class", "phaseRow")
    .merge(phaseRow)
      .attr("transform", function(d, i) {
        return "translate(0," + layout.yScale(i) + ")";
      })
      .each(phases);

  phaseRow.exit().remove();
/*
  function phases(row, rowIndex) {
    var height = layout.yScale.bandwidth(),
        width = 6,
        y = (layout.yScale.bandwidth() - height) / 2;

    function x1(d) {
      return layout.xScale(d.start);
    }

    function x2(d) {
      return layout.xScale(d.stop);
    }

    var r = layout.yScale.bandwidth() / 4;

    // Bind phase data
    var phase = d3.select(this).selectAll(".phase")
        .data(function(d) { return d; });

    // Enter
    var phaseEnter = phase.enter().append("g")
        .attr("class", "phase")
        .style("pointer-events", "none")
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
        .style("fill-opacity", state.phaseOverlayOpacity)
        .style("stroke-opacity", state.phaseOverlayOpacity);

    phaseEnter.append("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("fill", "none")
        .style("stroke", phaseColor)
        .style("stroke-dasharray", "5,5");

    phaseEnter.append("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("fill", "none")
        .style("stroke", function (d) { return d3.color(phaseColor(d)).darker(); })
        .style("stroke-dasharray", "5,5")
        .style("stroke-dashoffset", 5);

    phaseEnter.append("rect")
        .attr("x", function(d) { return x1(d) - width / 2; })
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("clip-path", "url(#clipLeft)");

    phaseEnter.append("rect")
        .attr("x", function(d) { return x2(d) - width / 2; })
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("clip-path", "url(#clipRight)");

    // Update
    var phaseUpdate = phaseEnter.merge(phase)
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
        .style("fill-opacity", state.phaseOverlayOpacity)
        .style("stroke-opacity", state.phaseOverlayOpacity);

    phaseUpdate.select("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("stroke", phaseColor);

    // XXX: This is ugly, should probably just bind data for circles above since there are two
    phaseUpdate.selectAll("rect")
      .data(function(d) { return [d, d]; })
        .attr("x", function(d, i) {
          return i === 0 ? x1(d) - width / 2 : x2(d) - width / 2;
        })
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);

    // Exit
    phase.exit().transition()
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)
        .remove();
  }
*/
/*
  function phases(row, rowIndex) {
    function x1(d) {
      return layout.xScale(d.start);
    }

    function x2(d) {
      return layout.xScale(d.stop);
    }

    var r = layout.yScale.bandwidth() / 6;

    // Bind phase data
    var phase = d3.select(this).selectAll(".phase")
        .data(function(d) { return d; });

    // Enter + update
    var phaseEnter = phase.enter().append("g")
        .attr("class", "phase")
        .style("pointer-events", "none")
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); });

    phaseEnter.append("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("fill", "none")
        .style("stroke", phaseColor);

    phaseEnter.append("circle")
        .attr("cx", x2)
        .attr("cy", layout.yScale.bandwidth() / 2)
        .attr("r", r);

    var phaseUpdate = phaseEnter.merge(phase)
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); });

    phaseUpdate.select("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("stroke", phaseColor);

    phaseUpdate.select("circle")
        .attr("cx", x2)
        .attr("cy", layout.yScale.bandwidth() / 2)
        .attr("r", r);

    // Exit
    phase.exit().transition()
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)
        .remove();
  }
*/
  function phases(row, rowIndex) {
    function x1(d) {
      return layout.xScale(d.start);
    }

    function x2(d) {
      return layout.xScale(d.stop);
    }

    var r = 3;

    // Bind phase data
    var phase = d3.select(this).selectAll(".phase")
        .data(function(d) { return d; });

    // Enter
    var phaseEnter = phase.enter().append("g")
        .attr("class", "phase")
        .style("pointer-events", "none")
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
        .style("fill-opacity", state.phaseOverlayOpacity)
        .style("stroke-opacity", state.phaseOverlayOpacity);

    phaseEnter.append("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("fill", "none")
        .style("stroke", phaseColor)
        .style("stroke-dasharray", "5,5");

    phaseEnter.append("line")
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2)
        .style("fill", "none")
        .style("stroke", function (d) {
          return d3.color(phaseColor(d)).darker();
        })
        .style("stroke-dasharray", "5,5")
        .style("stroke-dashoffset", 5);

    phaseEnter.append("circle")
        .attr("cx", x1)
        .attr("cy", layout.yScale.bandwidth() / 2)
        .attr("r", r)
        .attr("clip-path", "url(#clipLeft)");

    phaseEnter.append("circle")
        .attr("cx", x2)
        .attr("cy", layout.yScale.bandwidth() / 2)
        .attr("r", r)
        .attr("clip-path", "url(#clipRight)");

    // Update
    var phaseUpdate = phaseEnter.merge(phase)
        .style("fill", phaseColor)
        .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
        .style("fill-opacity", state.phaseOverlayOpacity)
        .style("stroke-opacity", state.phaseOverlayOpacity);

    // XXX: This is ugly, should probably just bind data for lines above since there are two
    phaseUpdate.selectAll("line")
      .data(function(d) { return [d, d]; })
        .attr("x1", x1)
        .attr("y1", layout.yScale.bandwidth() / 2)
        .attr("x2", x2)
        .attr("y2", layout.yScale.bandwidth() / 2);

    // XXX: This is ugly, should probably just bind data for circles above since there are two
    phaseUpdate.selectAll("circle")
      .data(function(d) { return [d, d]; })
        .attr("cx", function(d, i) { return i === 0 ? x1(d) : x2(d); })
        .attr("cy", layout.yScale.bandwidth() / 2)
        .attr("r", r);

    // Exit
    phase.exit().transition()
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)
        .remove();
  }
/*
  function phases(row, rowIndex) {
    function x(d) {
      return layout.xScale(d.start);
    }

    function width(d) {
      return layout.xScale(d.stop) - layout.xScale(d.start);
    }

    // Bind phase data
    var phase = d3.select(this).selectAll(".phase")
        .data(function(d) { return d; });

    // Enter + update
    phase.enter().append("rect")
        .attr("class", "phase")
        .attr("x", x)
        .attr("width", width)
        .attr("height", layout.yScale.bandwidth())
        .attr("shape-rendering", "crispEdges")
        .style("fill", phaseColor)
        .style("fill-opacity", 0)
        .style("stroke", phaseColor)
        .style("stroke-opacity", 0)
        .style("stroke-width", 2)
        .style("pointer-events", "none")
      .merge(phase)//.transition()
        .attr("x", x)
        .attr("width", width)
        .attr("height", layout.yScale.bandwidth())
        .style("fill-opacity", state.phaseOverlayOpacity)
        .style("stroke-opacity", state.phaseOverlayOpacity * 2);

    // Exit
    phase.exit().transition()
        .style("fill-opacity", 0)
        .remove();
  }
*/
  function rowOffset(row) {
    return state.alignment === "right" ?
           layout.xScale.domain()[1] - row[row.length - 1].time :
           layout.xScale.domain()[0] - row[0].time;
  }

  function color(d) {
/*
    if (state.phases[0].length > 0) {
      return state.alignment === "right" ?
              state.colorScale[rowIndex](d.time - row[row.length - 1].time)(d.value) :
              state.colorScale[rowIndex](d.time - row[0].time)(d.value);
    }
    else {
      return state.colorScale(d.value);
    }
  */
    return state.colorScale(d.value);
  }

  function phaseColor(d) {
    return state.phaseColorScale(d.name);
  }
};

module.exports = HeatMap;
