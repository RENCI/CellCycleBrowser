var d3 = require("d3");

module.exports = function() {
      // Size
  var margin = { top: 10, left: 50, bottom: 40, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return height - margin.top - margin.bottom; },

      // Data
      data,
      curves,
      timeSteps = d3.range(0, 5),

      // Start with empty selection
      svg = d3.select();

  function growthCurve(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select();

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "growthCurve")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "curves");
      g.append("g").attr("class", "legend");

      svg = svgEnter.merge(svg);

      createCurves();
      draw();
    });
  }

  function createCurves() {
    curves = [];

    // Check for cell data
    var cellData = data.species.filter(function(d) {
      return d.cellData.length > 0;
    }).map(function(d) {
      return d.cellData;
    });

    if (cellData.length > 0) {
      // Use first species for time span average
      var timeSpan = d3.mean(cellData[0], function(d) {
        return dataTimeSpan(d.values);
      });

      curves.push({
        name: "Data",
        timeSpan: timeSpan
      });
    }

    // Check for simulation output
    if (data.phases.length > 0) {
      var timeSpan = d3.mean(data.phases, dataTimeSpan);

      curves.push({
        name: "Simulation",
        timeSpan: timeSpan
      });
    }

    // Compute curves
    curves.forEach(function(curve) {
      curve.curve = timeSteps.map(function(d) {
        return [d, y(d)];
      });

      function y(d) {
        return Math.pow(2, (d / curve.timeSpan));
      }
    });

    function dataTimeSpan(d) {
      return (d[d.length - 1].stop - d[0].start) / 24;
    }
  }

  function draw() {
    if (curves.length === 0) return;

    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    var xScale = d3.scaleLinear()
        .domain([timeSteps[0], timeSteps[timeSteps.length - 1]])
        .range([0, innerWidth()]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(curves, function(d) {
          return d3.max(d.curve, function(d) {
            return d[1];
          });
        })])
        .range([innerHeight(), 0]);

    var colorScale = d3.scaleOrdinal()
        .domain(["Data", "Simulation"])
        .range(["#2166ac", "#b2182b"])

    drawAxes();
    drawCurves();
    drawLegend();

    function drawAxes() {
      var gAxes = svg.select(".axes");

      // X axis
      var xAxis = d3.axisBottom(xScale)
          .ticks(timeSteps.length);

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
          .text("Days")
          .attr("class", "xLabel")
          .attr("dy", "-1em")
          .style("text-anchor", "middle");

      gAxes.select(".xLabel")
          .attr("transform", "translate(" + (innerWidth() / 2) + "," + height + ")");

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
          .text("Fold Change")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)")
    }

    function drawCurves() {
      var line = d3.line()
          .curve(d3.curveMonotoneX)
          .x(function(d) { return xScale(d[0]); })
          .y(function(d) { return yScale(d[1]); });

      // Bind curve data
      var curve = svg.select(".curves").selectAll(".curve")
          .data(curves);

      // Enter + update
      var curveEnter = curve.enter().append("g")
          .attr("class", "curve")
        .merge(curve)
          .each(drawCurve);

      // Exit
      curve.exit().remove();

      function drawCurve(d) {
        var g = d3.select(this);

        var color = d.name.indexOf("Data") !== -1 ?
            colorScale("Data") : colorScale("Simulation");

        // Curve
        var curve = g.selectAll("path")
            .data([d.curve]);

        curve.enter().append("path")
            .style("fill", "none")
            .style("stroke", color)
          .merge(curve)
            .attr("d", line);

        // Points
        var point = g.selectAll("circle")
            .data(d.curve)

        point.enter().append("circle")
            .attr("r", 3)
            .style("fill", color)
            .style("stroke", "none")
          .merge(point)
            .attr("cx", function(d) { return xScale(d[0]); })
            .attr("cy", function(d) { return yScale(d[1]); });
      }
    }

    function drawLegend() {
      var spacing = 20;

      var yScale = d3.scaleLinear()
          .domain([0, curves.length - 1])
          .range([0, (curves.length - 1) * spacing]);

      var legend = svg.select(".legend")
          .attr("transform", "translate(50,50)");

      // Bind curve data
      var curve = svg.select(".legend").selectAll(".item")
          .data(curves);

      // Enter
      var curveEnter = curve.enter().append("g")
          .attr("class", "item");

      curveEnter.append("text");

      curveEnter.append("line");

      // Enter + update
      var curveUpdate = curveEnter.merge(curve);

      // XXX: Add code here

      // Exit
      curve.exit().remove();
    }
  };

  growthCurve.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return growthCurve;
  };

  growthCurve.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return growthCurve;
  };

  return growthCurve;
}
