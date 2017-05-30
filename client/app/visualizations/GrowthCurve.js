var d3 = require("d3");

module.exports = function() {
      // Size
  var margin = { top: 25, left: 50, bottom: 40, right: 20 },
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
      g.append("text").attr("class", "title");
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "curves");
      g.append("g").attr("class", "legend");

      svg = svgEnter.merge(svg);

      createCurves();
      draw();
    });
  }

  function createCurves() {
    // Get all sources (simulation or cell data)
    var sources = d3.set();
    data.tracks.forEach(function(d) {
      sources.add(d.source);
    });

    // Add a curve for each source
    curves = sources.values().map(function(source) {
      // Use first track for each source for time span
      var tracks = data.tracks.filter(function(d) {
        return d.source === source;
      })[0];

      return {
        name: source,
        timeSpan: d3.mean(tracks.data, function(d) {
          return d.timeSpan / 24;
        })
      };
    });

    // Compute curves
    curves.forEach(function(curve) {
      curve.curve = timeSteps.map(function(d) {
        return [d, y(d)];
      });

      function y(d) {
        return Math.pow(2, (d / curve.timeSpan));
      }
    });

    // Sort
    curves = curves.sort(function(a, b) {
      if (a.name === "Simulation") return 1;
      else if (b.name === "Simulation") return -1;
      return 0;
    });
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

    // XXX: Need to decide on a color map
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(curves.map(function(d) {
          return d.name;
        }));

    function curveColor(d) {
      return colorScale(d.name);
    }

    var circleRadius = 3;

    drawTitle();
    drawAxes();
    drawCurves();
    drawLegend();

    function drawTitle() {
      svg.select(".title")
          .text("Growth Curves")
          .attr("dy", "-.5em")
          .style("text-anchor", "middle")
          .attr("x", innerWidth() / 2);
    }

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

        var color = curveColor(d);

        // Curve
        var curve = g.selectAll("path")
            .data([d.curve]);

        curve.enter().append("path")
            .style("fill", "none")
          .merge(curve)
            .attr("d", line)
            .style("stroke", color);

        // Points
        var point = g.selectAll("circle")
            .data(d.curve)

        point.enter().append("circle")
            .attr("r", circleRadius)
            .style("stroke", "none")
          .merge(point)
            .attr("cx", function(d) { return xScale(d[0]); })
            .attr("cy", function(d) { return yScale(d[1]); })
            .style("fill", color);
      }
    }

    function drawLegend() {
      var x = 35,
          y = 20,
          spacing = 20,
          lineX = -2,
          lineWidth = 20;

      var itemScale = d3.scaleLinear()
          .domain([0, curves.length - 1])
          .range([0, (curves.length - 1) * spacing]);

      var legend = svg.select(".legend")
          .attr("transform", "translate(" + x + "," + y + ")");

      // Bind curve data
      var curve = svg.select(".legend").selectAll(".item")
          .data(curves);

      // Enter
      var curveEnter = curve.enter().append("g")
          .attr("class", "item");

      curveEnter.append("text")
          .attr("dy", ".35em")
          .style("font-size", "small")
          .style("text-anchor", "start");

      curveEnter.append("line")
          .attr("x1", lineX)
          .attr("x2", lineX - lineWidth);

      curveEnter.append("circle")
          .attr("cx", lineX - lineWidth / 2)
          .attr("r", circleRadius)
          .style("stroke", "none");

      // Enter + update
      var curveUpdate = curveEnter.merge(curve)
          .attr("transform", function(d, i) {
            // Fudge y a bit for crisp line
            return "translate(0," + (Math.round(itemScale(i)) + 0.5) + ")";
          });

      curveUpdate.select("text")
          .text(function(d) { return d.name; });

      curveUpdate.select("line")
          .style("stroke", curveColor);

      curveUpdate.select("circle")
          .style("fill", curveColor);

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
