var DataUtils = require("../utils/DataUtils");
var d3 = require("d3");
var d3Contour = require("d3-contour");

module.exports = function() {
      // Size
  var titleHeight = 45,
      margin = { top: titleHeight, left: 50, bottom: 40, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return innerWidth(); },

      // Data
      data = [],
      contours = [],

      // Appearance
      source = "",
      color = "darkblue",

      // Scales
      xScale = d3.scaleLog(),
      yScale = d3.scaleLog(),

      // Start with empty selection
      svg = d3.select();

  function flowCytometry(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "flowCytometry")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      // Add gradient for color scale legend
      svgEnter.append("defs").append("linearGradient")
          .attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0);

      var title = svgEnter.append("g").attr("class", "title");
      title.append("text").attr("class", "main");
      title.append("text").attr("class", "source");

      svgEnter.append("g").attr("class", "legend");

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "contours");
      g.append("g").attr("class", "points");
      g.append("g").attr("class", "labels");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    height = innerHeight() + margin.top + margin.bottom;

    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    xScale
        .domain(d3.extent(data.map(function(d) { return d.x; })))
        .range([0, innerWidth()]);

    yScale
        .domain(d3.extent(data.map(function(d) { return d.y; })))
        .range([innerHeight(), 0]);

    // Create contours, must be done after scales are updated
    createContours();

    // Create color scale from contour contours
    var c1 = d3.hsl(color);
    c1.l = 0.2;

    var c2 = d3.hsl(color);
    c2.l = 0.5;

    var c3 = d3.hsl(color);
    c3.l = 0.8;

    var contourExtent = d3.extent(contours, function(d) { return d.value; }),
        colorScale = d3.scaleLinear()
            .domain([contourExtent[0], d3.mean(contourExtent), contourExtent[1]])
            .range([c1, c2, c3]);

    drawTitle();
    drawAxes();
    drawPoints();
    drawLabels();
//    drawContours();
    drawLegend();

    function createContours() {
      // Create contours
      contours = d3Contour.contourDensity()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .size([innerWidth(), innerHeight()])
        .bandwidth(10)
        (data);
    }

    function drawTitle() {
      var title = svg.select(".title")
          .attr("transform", "translate(" + (width / 2) + ",0)");

      title.select(".main")
          .text("Cell Cycle Analysis")
          .attr("dy", "1.5em")
          .style("text-anchor", "middle");

      title.select(".source")
          .text(source)
          .attr("y", 20)
          .attr("dy", "1.5em")
          .style("text-anchor", "middle")
          .style("font-size", "x-small");
    }

    function drawAxes() {
      var format = ",.1s";

      var gAxes = svg.select(".axes");

      // X axis
      var xAxis = d3.axisBottom(xScale)
          .ticks(8, format)

      gAxes.selectAll(".xAxis")
          .data([0])
        .enter().append("g")
          .attr("class", "xAxis");

      gAxes.select(".xAxis")
          .attr("transform", "translate(0," + innerHeight() + ")")
          .call(xAxis);

      gAxes.selectAll(".xLabel")
          .data([0])
        .enter().append("text")
          .text("DAPI")
          .attr("class", "xLabel")
          .attr("dy", "2.5em")
          .style("text-anchor", "middle");

      gAxes.select(".xLabel")
          .attr("transform", "translate(" + (innerWidth() / 2) + "," + innerHeight() + ")");

      // Y axis
      var yAxis = d3.axisLeft(yScale)
          .ticks(8, format);

      gAxes.selectAll(".yAxis")
          .data([0])
        .enter().append("g")
          .attr("class", "yAxis")

      gAxes.select(".yAxis")
          .call(yAxis);

      gAxes.selectAll(".yLabel")
          .data([0])
        .enter().append("text")
          .text("Edu")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)");
    }

    function drawPoints() {
      // Bind cell data
      var point = svg.select(".points").selectAll(".point")
          .data(data);

      // Enter + update
      point.enter().append("circle")
          .attr("class", "point")
          .attr("r", 1)
        .merge(point)
          .attr("cx", function(d) { return xScale(d.x); })
          .attr("cy", function(d) { return yScale(d.y); })
          .style("fill", fill);

      // Exit
      point.exit().remove();

      function fill(d) {
        for (var i = contours.length - 1; i >= 0; i--) {
          var c = contours[i];

          for (var j = 0; j < c.coordinates.length; j++) {
            if (d3.polygonContains(c.coordinates[j][0], [xScale(d.x), yScale(d.y)])) {
              return colorScale(c.value);
            }
          }
        }

        return colorScale(contours[0].value);
      }
    }

    function drawLabels() {
      // Group cells by phase
      var phases = d3.nest()
          .key(function(d) { return d.phase.name; })
          .entries(data);

      // Bind data
      var label = svg.select(".labels").selectAll(".label")
          .data(phases, function(d) { return d.key; });

      // Enter
      var labelEnter = label.enter().append("g")
          .attr("class", "label")
          .attr("dy", "-.5em")
          .style("font-size", "x-small")
          .style("text-anchor", "middle");

      labelEnter.append("text")
          .style("fill", "white")
          .style("stroke", "white")
          .style("stroke-width", 2)
          .style("fill-opacity", 0.75)
          .style("stroke-opacity", 0.75);

      labelEnter.append("text")
          .style("fill", "black");

      // Label update
      labelEnter.merge(label)
          .attr("transform", function(d) {
            var x = d3.mean(d.values, function(d) { return d.x; }),
                y = d3.mean(d.values, function(d) { return d.y; });

            return "translate(" + xScale(x) + "," + yScale(y) + ")";
          })
        .selectAll("text")
          .text(function(d) { return d.key; });

      // Exit
      label.exit().remove();
    }

    function drawContours() {
      // Bind contours
      var contour = svg.select(".contours").selectAll(".contour")
          .data(contours);

      // Enter + update
      contour.enter().append("path")
          .attr("class", "contour")
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-opacity", 0.1)
          .style("stroke-linejoin", "round")
        .merge(contour)
          .attr("d", d3.geoPath());

      // Exit
      contour.exit().remove();
    }

    function drawLegend() {
      var w = 10,
          h = 40,
          m = 15,
          x = width - w - m,
          y = 32;

      // Remove non "word" characters
      var id = DataUtils.removeNonWord(source) + "_Gradient";

      // Update gradient
      var values = colorScale.domain(),
          stopScale = d3.scaleLinear()
              .domain(d3.extent(values))
              .range([0, 1]);

      var stop = svg.select("linearGradient")
          .attr("id", id)
        .selectAll("stop")
          .data(values);

      stop.enter().append("stop").merge(stop)
          .attr("offset", function(d) { return stopScale(d); })
          .attr("stop-color", function(d) { return colorScale(d); });

      stop.exit().remove();

      // Draw legend
      var g = svg.select(".legend").selectAll("g")
          .data([0]);

      // Enter
      var gEnter = g.enter().append("g");

      gEnter.append("rect");

      gEnter.selectAll("text")
          .data(["max", "min"])
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("dx", "-.5em")
          .attr("y", function(d, i) { return i === 0 ? 0 : h; })
          .style("text-anchor", "end")
          .style("dominant-baseline", "middle")
          .style("font-size", "x-small");

      // Update
      gEnter.merge(g)
          .attr("transform", "translate(" + x + "," + y + ")")
        .select("rect")
          .attr("width", w)
          .attr("height", h)
          .attr("fill", "url(#" + id + ")")
          .attr("stroke", "black");
    }
  };

  flowCytometry.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return flowCytometry;
  };

  flowCytometry.source = function(_) {
    if (!arguments.length) return source;
    source = _;
    return flowCytometry;
  };

  flowCytometry.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return flowCytometry;
  };

  return flowCytometry;
}
