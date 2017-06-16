var d3 = require("d3");
var d3Contour = require("d3-contour");
var d3ScaleChromatic = require("d3-scale-chromatic");

module.exports = function() {
      // Size
  var titleHeight = 40,
      margin = { top: titleHeight, left: 50, bottom: 40, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return innerWidth(); },

      // Data
      data = [],
      contours = [],

      // Scales
      xScale = d3.scaleLinear()
          .domain([0.5, 2.5]),
      yScale = d3.scaleLinear()
          .domain([0, 4]),

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

      svgEnter.append("text").attr("class", "title");

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "contours");
      g.append("g").attr("class", "points");

      svg = svgEnter.merge(svg);

      draw();
    });
  }

  function draw() {
    var height = innerHeight() + margin.top + margin.bottom;

    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    xScale.range([0, innerWidth()]);

    yScale.range([innerHeight(), 0]);

    // Create contours, must be done after scales are updated
    createContours();

    drawTitle();
    drawAxes();
    drawPoints();
    drawContours();

    function createContours() {
      // Create contours
      contours = d3Contour.contourDensity()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .size([innerWidth(), innerHeight()])
    //      .bandwidth(40)
        (data);
    }

    function drawTitle() {
      svg.select(".title")
          .text("Flow Cytometry")
          .attr("dy", "1.5em")
          .style("text-anchor", "middle")
          .attr("x", width / 2);
    }

    function drawAxes() {
      var gAxes = svg.select(".axes");

      // X axis
      var xAxis = d3.axisBottom(xScale);

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
          .text("X")
          .attr("class", "xLabel")
          .attr("dy", "2.5em")
          .style("text-anchor", "middle");

      gAxes.select(".xLabel")
          .attr("transform", "translate(" + (innerWidth() / 2) + "," + innerHeight() + ")");

      // Y axis
      var yAxis = d3.axisLeft(yScale);

      gAxes.selectAll(".yAxis")
          .data([0])
        .enter().append("g")
          .attr("class", "yAxis")

      gAxes.select(".yAxis")
          .call(yAxis);

      gAxes.selectAll(".yLabel")
          .data([0])
        .enter().append("text")
          .text("Y")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)")
    }

    function drawPoints() {
      // Create color scale from density contours
      var colorScale = d3.scaleSequential(d3ScaleChromatic.interpolateYlOrBr)
          .domain(d3.extent(contours, function(d) { return d.value; }));

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
          .style("fill", color);

      // Exit
      point.exit().remove();

      function color(d) {
        for (var i = contours.length - 1; i >= 0; i--) {
          var c = contours[i];

          if (d3.polygonContains(c.coordinates[0][0], [xScale(d.x), yScale(d.y)])) {
            return colorScale(c.value);
          }
        }

        return colorScale(contours[0].value);
      }
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
  };

  flowCytometry.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return flowCytometry;
  };

  return flowCytometry;
}
