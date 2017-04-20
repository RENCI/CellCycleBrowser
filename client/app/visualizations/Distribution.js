var d3 = require("d3");

module.exports = function() {
      // Size
  var margin = { top: 10, left: 50, bottom: 40, right: 20 },
      width = 200,
      height = 200,
      innerWidth = function() { return width - margin.left - margin.right; },
      innerHeight = function() { return height - margin.top - margin.bottom; },

      // Data
      data = [],
      cells = [],

      // Scales
      xScale = d3.scaleLinear()
          .domain([0.5, 2.5]),
      yScale = d3.scaleLinear()
          .domain([0, 4]),

      // Start with empty selection
      svg = d3.select();

  function distribution(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "Distribution")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      var g = svgEnter.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Groups for layout
      g.append("g").attr("class", "axes");
      g.append("g").attr("class", "points");

      svg = svgEnter.merge(svg);

      createCells();
      draw();
    });
  }

  function createCells() {
    // Number of cells
    var n = 5000;

    // Normalized random distribution function
    var randn = normalRandom(6);

    console.log(data);

    // Create phase objects with probabilities
    var phases = data.map(function(d) {
      return {
        name: d.reactant.replace("_end", ""),
        kf: d.kf,
        p: 1 / d.kf
      };
    });

    // Number of S subphases
    var numS = phases.filter(function(d) {
      return d.name.indexOf("S") !== - 1;
    }).length;

    // Normalize probabilities
    var pSum = d3.sum(phases, function(d) { return d.p; });

    phases.forEach(function(d) {
      d.p /= pSum;
    });

    // Create cumulative probabilities for sampling
    phases.reduce(function(p, c) {
      return c.cumP = c.p + p;
    }, 0);

    cells = d3.range(0, n).map(function() {
      var cell = {},
          x = Math.random();

      // Determine phase for cell
      for (var i = 0; i < phases.length; i++) {
        if (x < phases[i].cumP) {
          cell.phase = phases[i];
          break;
        }
      }

      // Position the cell based on phase
      var name = cell.phase.name;

      if (name.indexOf("G1") !== -1) {
        cell.x = 1;
        cell.y = 1;

        // Random offset
        cell.x += 0.5 * randn();
        cell.y += 0.5 * randn();
      }
      else if (name.indexOf("G2") !== -1) {
        cell.x = 2;
        cell.y = 1;

        // Random offset
        cell.x += 0.5 * randn();
        cell.y += 0.5 * randn();
      }
      else if (name.indexOf("S") !== -1) {
        // Get S subphase index
        var sIndex = +name.substr(name.indexOf("_") + 1) - 1;

//        cell.x = 1 + 0.25 + sIndex / numS;
        cell.x = 1.5;
        cell.y = 2;

        // Random offset
        var r = 2 * randn();
        cell.x += r;
        cell.y += -Math.abs(r) + 2 * randn();
      }
      else {
        console.log("Phase not handled");
        cell.x = cell.y = 0;
      }

      return cell;
    });

    function normalRandom(n) {
      return function() {
        var rand = 0;

        for (var i = 0; i < n; i ++) {
          rand += Math.random() - 0.5;
        }

        return rand / n;
      }
    }
  }

  function draw() {
    // Update svg size
    svg .attr("width", width)
        .attr("height", height);

    // Update scales
    xScale.range([0, innerWidth()]);

    yScale.range([innerHeight(), 0]);

    drawAxes();
    drawPoints();

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
          .text("Y")
          .attr("class", "yLabel")
          .attr("dy", "-2.25em")
          .style("text-anchor", "middle");

      gAxes.select(".yLabel")
          .attr("transform", "translate(0," + (innerHeight() / 2) + ")rotate(-90)")
    }

    function drawPoints() {
      // Bind cell data
      var point = svg.select(".points").selectAll(".point")
          .data(cells);

      // Enter + update
      point.enter().append("circle")
          .attr("r", 2)
          .style("fill-opacity", 0.2)
        .merge(point)
          .attr("cx", function(d) { return xScale(d.x); })
          .attr("cy", function(d) { return yScale(d.y); });

      // Exit
      point.exit().remove();
    }
  };

  distribution.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return distribution;
  };

  distribution.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return distribution;
  };

  return distribution;
}
