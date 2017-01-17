var d3 = require("d3");

var HeatLine = {};

HeatLine.create = function(element, props, state) {
  // Create skeletal chart
  var svg = d3.select(element).append("svg")
      .attr("class", "heatLine")
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

  g.append("rect")
      .attr("class", "border");
  g.append("g")
      .attr("class", "row");
  g.append("g")
      .attr("class", "phaseRow");
  g.append("rect")
      .attr("class", "highlight")
      .attr("shape-rendering", "crispEdges")
      .attr("pointer-events", "none")
      .style("fill", "none")
      .style("stroke", "none")
      .style("stroke-width", 2);

  this.update(element, state);
};

HeatLine.update = function(element, state) {
  var svg = d3.select(element).select(".heatLine");
//      .attr("width", props.width)
//      .attr("height", props.height);

  var layout = this.layout(svg, state);

  this.draw(svg, layout, state);
};

HeatLine.layout = function(svg, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  var timeExtent = d3.extent(state.data, function(d) { return d.time; });

  var xScale = d3.scaleLinear()
      .domain(state.alignment === "left" ?
              state.timeExtent :
              [state.timeExtent[0] - (state.timeExtent[1] - timeExtent[1]),
               timeExtent[1]])
      .range([0, width]);

  return {
    xScale: xScale
  };
};

HeatLine.destroy = function(element) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

HeatLine.draw = function(svg, layout, state) {
  var width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10);

  // Border
  var border = svg.select("g").select(".border")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 4)
    .transition()
      .attr("x", layout.xScale(state.data[0].time))
      .attr("width", layout.xScale(state.data[state.data.length - 1].time) -
                     layout.xScale(state.data[0].time) + 10)
      .attr("height", height);

  // Row
  var row = svg.select("g").select(".row")
      .datum(state.data);

  // Cells
  var cell = row.selectAll(".cell")
      .data(function(d) { return d; });

  cell.enter().append("rect")
      .attr("class", "cell")
      .attr("x", function(d) { return layout.xScale(d.time); })
      .attr("width", 10)
      .attr("height", height)
      .attr("shape-rendering", "crispEdges")
      .attr("data-toggle", "tooltip")
      .attr("data-original-title", function(d) { return d.value.toPrecision(3); })
      .style("fill", "white")
      .style("stroke-width", 2)
      .on("mouseover", function(d) {
        svg.select(".highlight")
            .attr("x", layout.xScale(d.time))
            .attr("width", 10)
            .attr("height", height)
            .style("stroke", highlightColor(color(d)));

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
    .merge(cell).transition()
      .attr("x", function(d) { return layout.xScale(d.time); })
      .attr("width", 10)
      .attr("height", height)
      .attr("data-original-title", function(d) { return d.value; })
      .style("fill", color);

  cell.exit().transition()
      .style("fill", "white")
      .remove();

  // Phase row
  var phaseRow = svg.select("g").select(".phaseRow")
      .datum(state.phases);

  // Phases
  function x1(d) {
    return layout.xScale(d.start);
  }

  function x2(d) {
    return layout.xScale(d.stop);
  }

  var r = height / 4;

  var phase = phaseRow.selectAll(".phase")
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
      .attr("y1", height / 2)
      .attr("x2", x2)
      .attr("y2", height / 2)
      .style("fill", "none")
      .style("stroke", phaseColor);

  phaseEnter.append("circle")
      .attr("cx", x1)
      .attr("cy", height / 2)
      .attr("r", r)
      .attr("clip-path", "url(#clipLeft)");

  phaseEnter.append("circle")
      .attr("cx", x2)
      .attr("cy", height / 2)
      .attr("r", r)
      .attr("clip-path", "url(#clipRight)");

  // Update
  var phaseUpdate = phaseEnter.merge(phase)
      .style("fill", phaseColor)
      .style("stroke", function(d) { return d3.color(phaseColor(d)).darker(); })
      .style("fill-opacity", state.phaseOverlayOpacity)
      .style("stroke-opacity", state.phaseOverlayOpacity);

  phaseUpdate.select("line")
      .attr("x1", x1)
      .attr("y1", height / 2)
      .attr("x2", x2)
      .attr("y2", height / 2)
      .style("stroke", phaseColor);

  // XXX: This is ugly, should probably just bind data for circles above since there are two
  phaseUpdate.selectAll("circle")
    .data(function(d) { return [d, d]; })
      .attr("cx", function(d, i) { return i === 0 ? x1(d) : x2(d); })
      .attr("cy", height / 2)
      .attr("r", r);

  // Exit
  phase.exit().transition()
      .style("fill-opacity", 0)
      .style("stroke-opacity", 0)
      .remove();
/*
  // Phases
  function x(d) {
    return layout.xScale(d.start);
  }

  function width(d) {
    return layout.xScale(d.stop) - layout.xScale(d.start);
  }

  var phase = phaseRow.selectAll(".phase")
      .data(function(d) { return d; });

  phase.enter().append("rect")
      .attr("class", "phase")
      .attr("x", x)
      .attr("width", width)
      .attr("height", height)
      .attr("shape-rendering", "crispEdges")
      .style("fill", phaseColor)
      .style("fill-opacity", 0)
      .style("stroke", phaseColor)
      .style("stroke-opacity", 0)
      .style("stroke-width", 2)
      .style("pointer-events", "none")
    .merge(phase).transition()
      .attr("x", x)
      .attr("width", width)
      .attr("height", height)
      .style("fill-opacity", 0.1)
      .style("stroke-opacity", 0.4);

  phase.exit().transition()
      .style("fill-opacity", 0)
      .remove();
*/

  function color(d, row) {
/*
    return state.phases.length > 0 ?
           state.colorScale(d.time)(d.value) :
           state.colorScale(d.value);
*/
    return state.colorScale(d.value);
  }

  function phaseColor(d) {
    return state.phaseColorScale(d.name);
  }
};

module.exports = HeatLine;
