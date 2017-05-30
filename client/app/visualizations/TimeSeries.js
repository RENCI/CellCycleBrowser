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
      sources,

      // Start with empty selection
      svg = d3.select();

  function timeSeries(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "timeSeries")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "title");
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
    data.tracks.forEach(function(track) {
      [track.average].concat(track.data).forEach(function(d) {
        if (d.selected) {
          curves.push({
            name: d.name,
            source: track.source,
            trackIndex: track.index,
            curve: d.values.map(function(d) {
              return [d.start, d.value];
            })
          });
        }
      });
    });
  }

  function draw() {
    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(curves, function(d) {
          return d3.max(d.curve, function(d) {
            return d[0];
          });
        })])
        .range([0, innerWidth()]);

    var yScales = data.tracks.map(function(d) {
      return d3.scaleLinear()
          .domain(d.dataExtent)
          .range([innerHeight(), 0]);
    });

    // XXX: Need to use global color map
    var sources = d3.set();
    data.tracks.forEach(function(d) {
      sources.add(d.source);
    });
    sources = sources.values();

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(sources);

    function curveColor(d) {
      return colorScale(d.source);
    }

    var circleRadius = 3;

    drawTitle();
    drawAxes();
    drawCurves();
    drawLegend();

    function drawTitle() {
      var title = svg.select(".title").selectAll("text")
          .data(["Time Series"]);

      title.enter().append("text")
          .text(function(d) { return d; })
          .attr("dy", ".8em")
          .style("text-anchor", "middle")
        .merge(title)
          .attr("x", innerWidth() / 2);
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
          .text("Hours")
          .attr("class", "xLabel")
          .attr("dy", "-1em")
          .style("text-anchor", "middle");

      gAxes.select(".xLabel")
          .attr("transform", "translate(" + (innerWidth() / 2) + "," + height + ")");

      // Y axis
      var yScale = d3.scaleOrdinal()
          .domain(["min", "max"])
          .range([innerHeight(), 0]);

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
          .text("Value")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)")
    }

    function drawCurves() {
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

        var yScale = yScales[d.trackIndex];

        var line = d3.line()
            .curve(d3.curveLinear)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); });

        // Curve
        var curve = g.selectAll("path")
            .data([d.curve]);

        curve.enter().append("path")
            .style("fill", "none")
          .merge(curve)
            .attr("d", line)
            .style("stroke", curveColor(d))
            .style("stroke-width", d.name === "Average" ? 2 : 1);
      }
    }

    function drawLegend() {
      var x = 35,
          y = 40,
          spacing = 20,
          lineX = -2,
          lineWidth = 20;

      var itemScale = d3.scaleLinear()
          .domain([0, curves.length - 1])
          .range([0, (curves.length - 1) * spacing]);

      var legend = svg.select(".legend")
          .attr("transform", "translate(" + x + "," + y + ")");

      // Bind curve data
      var legendItems = sources.filter(function(d) {
        return curves.map(function(e) {
          return e.source;
        }).indexOf(d) !== -1;
      });

      var curve = svg.select(".legend").selectAll(".item")
          .data(legendItems);

      // Enter
      var curveEnter = curve.enter().append("g")
          .attr("class", "item");

      curveEnter.append("text")
          .attr("dy", ".35em")
          .style("font-size", "small")
          .style("text-anchor", "start");

      curveEnter.append("line")
          .attr("x1", lineX)
          .attr("x2", lineX - lineWidth)
          .style("stroke-width", 2);

      // Enter + update
      var curveUpdate = curveEnter.merge(curve)
          .attr("transform", function(d, i) {
            // Fudge y a bit for crisp line
            return "translate(0," + (Math.round(itemScale(i)) + 0.5) + ")";
          });

      curveUpdate.select("text")
          .text(function(d) { return d; });

      curveUpdate.select("line")
          .style("stroke", function(d) {
            return colorScale(d);
          });

      // Exit
      curve.exit().remove();
    }
  };

  timeSeries.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return timeSeries;
  };

  timeSeries.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return timeSeries;
  };

  return timeSeries;
}
