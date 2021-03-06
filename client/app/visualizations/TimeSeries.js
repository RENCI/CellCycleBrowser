var d3 = require("d3");

module.exports = function() {
      // Size
  var titleHeight = 40,
      legendItemHeight = 20,
      phaseHeight = 10,
      margin = { top: titleHeight, left: 50, bottom: 40, right: 20 },
      width = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return innerWidth(); },

      // Data
      data,
      curves,
      phases,
      alignment = "left",

      // Appearance
      minDistance = 4,

      // Scales
      phaseColorScale = d3.scaleOrdinal(),

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("highlightTrace");

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
      g.append("g").attr("class", "curves");
      g.append("g").attr("class", "averageCurves");
      g.append("g").attr("class", "phases");
      g.append("g").attr("class", "axes");

      svg = svgEnter.merge(svg);

      createCurves();
      createPhases();
      draw();
    });
  }

  function createCurves() {
    curves = [];

    data.tracks.filter(function(track) {
      return !track.phaseTrack;
    }).forEach(function(track) {
      track.traces.concat([track.average]).forEach(function(trace) {
        if (trace.selected) {
          curves.push({
            trace: trace,
            curve: trace.values.map(function(d) {
              return [d.start, d.value];
            })
          });
        }
      });
    });
  }

  function createPhases() {
    phases = d3.merge(data.tracks.filter(function(track) {
      return track.phaseTrack;
    }).map(function(track) {
      return track.traces.concat([track.average]).filter(function(trace) {
        return trace.selected;
      });
    }));

    if (phases.length > 0) phases = phases[0].phases;
  }

  function draw() {
    // Get the active tracks
    var activeTracks = curves.reduce(function(p, c) {
      if (p.map(function(d) {
        return d.trace.track;
      }).indexOf(c.trace.track) === -1) {
        p.push(c);
      }

      return p;
    }, []);

    // Compute margin for title and legend
    margin.top = titleHeight + legendItemHeight * (activeTracks.length) + phaseHeight;

    // Compute height
    var height = innerHeight() + margin.top + margin.bottom;

    // Update svg size
    svg .attr("width", width)
        .attr("height", height)
      .select(".chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Update scales
    var xMin = curves.length > 0 ? d3.min(curves, function(d) { return d.curve[0][0]; }) : 0,
        xMax = curves.length > 0 ? d3.max(curves, function(d) { return d.curve[d.curve.length - 1][0]; }) : 0;

    if (phases.length > 0) {
      var phaseMin = phases[0].start;
      if (phaseMin < xMin) xMin = phaseMin;

      var phaseMax = phases[phases.length -1].stop;
      if (phaseMax > xMax) xMax = phaseMax;
    }

    var xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, innerWidth()]);

    var yScale = d3.scaleLinear()
        .range([innerHeight(), 0]);

    function curveColor(d) {
      return d.trace.track.color;
    }

    var doHighlight = curves.reduce(function(p, c) {
      return p || c.trace.highlight !== null;
    }, false);

    // Update tooltips
    $(".timeSeries .curve").tooltip("hide");

    drawTitle();
    drawAxes();
    drawCurves(svg.select(".curves"),
               curves.filter(function(d) {
                 return d.trace.name !== "Average";
               }).reverse());
    drawCurves(svg.select(".averageCurves"),
               curves.filter(function(d) {
                 return d.trace.name === "Average";
               }).reverse());
    drawPhases();
    drawLegend();

    // Update tooltips
    $(".timeSeries .curve").tooltip({
      container: "body",
      placement: "auto left",
      animation: false,
      html: true
    });

    svg.selectAll(".curve")
      .each(function(d) {
        $(this).tooltip(d.trace.highlight === "primary" ? "show" : "hide");
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

      // Add rectangle to clip lines past y axis
      var clipWidth = margin.left;

      var clip = gAxes.selectAll(".axisClip")
          .data([0]);

      clip.enter().append("rect")
          .attr("class", "axisClip")
          .style("fill", "white")
        .merge(clip)
          .attr("x", -clipWidth)
          .attr("y", 0)
          .attr("width", clipWidth)
          .attr("height", innerHeight());

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
          .text("Normalized Signal")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)")
    }

    function drawCurves(selection, data) {
      // Bind curve data
      var curve = selection.selectAll(".curve")
          .data(data);

      var sortScale = d3.scaleOrdinal()
          .domain(["none", "secondary", "primary"])
          .range([0, 1, 2]);

      // Enter + update
      curve.enter().append("g")
          .attr("class", "curve")
          .attr("data-toggle", "tooltip")
          .on("mouseover", function(d) {
            dispatcher.call("highlightTrace", this, d.trace);
          })
          .on("mouseout", function() {
            dispatcher.call("highlightTrace", this, null);
          })
        .merge(curve)
          .sort(function(a, b) {
            var v1 = a.trace.highlight ? a.trace.highlight : sortScale.domain()[0],
                v2 = b.trace.highlight ? b.trace.highlight : sortScale.domain()[0];

            return d3.ascending(sortScale(v1), sortScale(v2));
          })
          .style("stroke-dasharray", function(d) {
            if (doHighlight) {
              return d.trace.highlight === "primary" ? null :
                     d.trace.highlight === "secondary" ? "4 8" :
                     null;
            }
          })
          .style("stroke-opacity", function(d) {
            if (doHighlight) {
              return d.trace.highlight === "primary" ? 1 :
                     d.trace.highlight === "secondary" ? 1 :
                     0.1;
            }
            else {
              return null;
            }
          })
          .each(drawCurve);

      // Exit
      curve.exit().remove();

      function drawCurve(d) {
        var curveData = [d.curve[0]];
        d.curve.forEach(function(d, i) {
          if (i === 0) return;

          var previous = curveData[curveData.length - 1];

          var x0 = xScale(previous[0]),
              y0 = yScale(previous[1]),
              x1 = xScale(d[0]),
              y1 = yScale(d[1]),
              x = x1 - x0,
              y = y1 - y0,
              distance = Math.sqrt(x * x + y * y);

          if (distance >= minDistance) curveData.push(d);
        });

        var g = d3.select(this)
            .attr("data-original-title",
              d.trace.track.source + ": " +
              d.trace.track.species +
              (d.trace.track.feature ? " - " + d.trace.track.feature : "") + "<br>" +
              d.trace.name);

        // Set y scale to extent for this trace, or this track
        yScale.domain(d.trace.track.rescaleTraces ?
            d3.extent(d.curve.map(function(d) { return d[1]; })) :
            d.trace.track.dataExtent);

        var line = d3.line()
            .curve(d3.curveLinear)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); });

        // Curve background
        if (d.trace.name === "Average") {
          var curve = g.selectAll(".background")
              .data([curveData]);

          curve.enter().append("path")
              .attr("class", "background")
              .style("fill", "none")
            .merge(curve)
              .attr("d", line)
              .style("stroke", "white")
              .style("stroke-width", 4);
        }

        // Curve
        var curve = g.selectAll(".foreground")
            .data([curveData]);

        curve.enter().append("path")
            .attr("class", "foreground")
            .style("fill", "none")
            .style("pointer-events", d.trace.name === "Average" ? "none" : null)
          .merge(curve)
            .attr("d", line)
            .style("stroke", curveColor(d))
            .style("stroke-width", d.trace.name === "Average" ? 2 : 1);
      }
    }

    function drawPhases() {
      var strokeWidth = 2;

      var phase = svg.select(".phases").selectAll(".phase")
          .data(phases);

      phase.enter().append("rect")
          .attr("class", "phase")
          .attr("y", -(phaseHeight + 2))
          .attr("height", phaseHeight)
          .attr("rx", phaseHeight / 4)
          .attr("ry", phaseHeight / 4)
          .style("fill", "white")
          .style("stroke-width", strokeWidth)
        .merge(phase)
          .attr("x", x)
          .attr("width", width)
          .style("stroke", function(d) {
            return phaseColorScale(d.name);
          });

      phase.exit().remove();

      var transition = svg.select(".phases").selectAll(".transition")
          .data(phases);

      transition.enter().append("line")
          .attr("class", "transition")
          .attr("shape-rendering", "crispEdges")
          .attr("stroke", "black")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "5 5")
        .merge(transition)
          .attr("x1", tx)
          .attr("x2", tx)
          .attr("y2", innerHeight());

      transition.exit().remove();

      function x(d) {
        return xScale(d.start) + strokeWidth / 2;
      }

      function width(d) {
        return Math.max(xScale(d.stop) - xScale(d.start) - strokeWidth, 0);
      }

      function tx(d) {
        return xScale(d.stop);
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
      var curve = legend.selectAll(".item")
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
            return d.trace.track.source + ": " +
                   d.trace.track.species +
                   (d.trace.track.feature ? " - " + d.trace.track.feature : "");
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

  timeSeries.phaseColorScale = function(_) {
    if (!arguments.length) return phaseColorScale;
    phaseColorScale = _;
    return timeSeries;
  };

  // For registering event callbacks
  timeSeries.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? timeSeries : value;
  };

  return timeSeries;
}
