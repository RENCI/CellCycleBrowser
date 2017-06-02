var d3 = require("d3");

module.exports = function() {
      // Size
  var titleHeight = 40,
      legendItemHeight = 20,
      margin = { top: titleHeight, left: 50, bottom: 40, right: 20 },
      width = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return innerWidth(); },

      // Data
      data,
      curves,
      alignment = "left",

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

      svgEnter.append("text").attr("class", "title");
      svgEnter.append("g").attr("class", "legend");

      var g = svgEnter.append("g").attr("class", "chart");

      // Groups for layout
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "curves");

      svg = svgEnter.merge(svg);

      createCurves();
      draw();
    });
  }

  function createCurves() {
    curves = [];

    data.tracks.forEach(function(track) {
      [track.average].concat(track.traces).forEach(function(trace) {
        if (trace.selected) {
          curves.push({
            name: trace.name,
            track: track,
            curve: trace.values.map(function(d) {
              return [d.start, d.value];
            })
          });
        }
      });
    });
  }

  function draw() {
    // Get the active tracks
    var activeTracks = curves.reduce(function(p, c) {
      if (p.map(function(d) {
        return d.track;
      }).indexOf(c.track) === -1) {
        p.push(c);
      }

      return p;
    }, []);

    // Compute margin for title and legend
    margin.top = titleHeight + legendItemHeight * (activeTracks.length);

    // Compute height
    var height = innerHeight() + margin.top + margin.bottom;

    // Update svg size
    svg .attr("width", width)
        .attr("height", height)
      .select(".chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Update scales
    var xScale = d3.scaleLinear()
        .domain([
          d3.min(curves, function(d) { return d.curve[0][0]; }),
          d3.max(curves, function(d) { return d.curve[d.curve.length - 1][0]; })
        ])
        .range([0, innerWidth()]);

    var yScales = data.tracks.map(function(d) {
      return d3.scaleLinear()
          .domain(d.dataExtent)
          .range([innerHeight(), 0]);
    });

    function curveColor(d) {
      return d.track.color;
    }

    var circleRadius = 3;

    drawTitle();
    drawAxes();
    drawCurves();
    drawLegend();

    // Update tooltips
    $(".timeSeries .curves > g").tooltip({
      container: "body",
      placement: "auto top",
      animation: false,
      html: true
    });

    function drawTitle() {
      svg.select(".title")
          .text("Time Series")
          .attr("dy", "1.5em")
          .style("text-anchor", "middle")
          .attr("x", width / 2);
    }

    function drawAxes() {
      var gAxes = svg.select(".axes");

      // X axis
      var xAxisScale = d3.scaleLinear()
          .range([0, innerWidth()]);

      // Set scale domain for axis based on alignment
      if (alignment === "left") {
        xAxisScale.domain(xScale.domain());
      }
      else if (alignment === "justify") {
        xAxisScale.domain([0, 100]);
      }
      else if (alignment === "right") {
        var d = xScale.domain();
        xAxisScale.domain([-(d[1] - d[0]), 0]);
      }

      var xAxis = d3.axisBottom(xAxisScale);

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
          .attr("class", "xLabel")
          .attr("dy", "2.5em")
          .style("text-anchor", "middle");

      gAxes.select(".xLabel")
          .text(alignment === "justify" ? "Time (%)" : "Time (h)")
          .attr("transform", "translate(" + (innerWidth() / 2) + "," + innerHeight() + ")");

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
          .attr("data-toggle", "tooltip")
          .on("mouseover", function(d) {
            svg.select(".curves").selectAll(".curve").each(function(e) {
              if (e !== d) {
                d3.select(this).select("path")
                    .style("stroke-opacity", 0.1);
              }
            });
          })
          .on("mouseout", function(d) {
            svg.select(".curves").selectAll("path")
                .style("stroke-opacity", null);
          })
        .merge(curve)
          .each(drawCurve);

      // Exit
      curve.exit().remove();

      function drawCurve(d) {
        var g = d3.select(this)
            .attr("data-original-title",
              d.track.source + ": " +
              d.track.species +
              (d.track.feature ? " - " + d.track.feature : "") + "<br>" +
              d.name);

        var yScale = yScales[d.track.index];

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
      var lineX = -2,
          lineWidth = 20,
          x = margin.left + lineWidth / 2,
          y = titleHeight;

      var itemScale = d3.scaleLinear()
          .domain([0, curves.length - 1])
          .range([0, (curves.length - 1) * legendItemHeight]);

      var legend = svg.select(".legend")
          .attr("transform", "translate(" + x + "," + y + ")");

      // Bind one curve for each track
      var curve = svg.select(".legend").selectAll(".item")
          .data(activeTracks);

      // Enter
      var curveEnter = curve.enter().append("g")
          .attr("class", "item");

      curveEnter.append("text")
          .attr("dy", ".35em")
          .style("font-size", "smaller")
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
          .text(function(d) {
            return d.track.source + ": " +
                   d.track.species +
                   (d.track.feature ? " - " + d.track.feature : "");
          });

      curveUpdate.select("line")
          .style("stroke", curveColor);

      // Exit
      curve.exit().remove();
    }
  };

  timeSeries.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return timeSeries;
  };

  timeSeries.alignment = function(_) {
    if (!arguments.length) return alignment;
    alignment = _;
    return timeSeries;
  };

  return timeSeries;
}
