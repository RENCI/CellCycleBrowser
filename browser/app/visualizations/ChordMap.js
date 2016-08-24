var d3 = require("d3");

module.exports = function() {
      // Size
  var width = 200,
      height = 200,

      // Data
      data,

      // Start with empty selection
      svg = d3.select(),

      // Event dispatcher
      dispatcher = d3.dispatch("selectPhase", "selectSpecies");

  function chordMap(selection) {
    selection.each(function(d) {
      data = d;

      svg = d3.select(this).selectAll("svg")
          .data([data]);

      var svgEnter = svg.enter().append("svg")
          .attr("class", "chordMap")
          .on("mousedown", function() {
            // Stop text highlighting
            d3.event.preventDefault();
          });

      svg = svg.merge(svgEnter);

      var g = svgEnter.append("g");

      // Groups for layout
      g.append("g")
          .attr("class", "ribbons");

      g.append("g")
          .attr("class", "arcs");

      doLayout();
      draw();
    });
  }

  function doLayout() {
/*

    // Construct mn x mn matrix
    var n = data.species.length;
    var m = data.phases.length;
    matrix = zero2D(n + m, n + m);

    console.log(data.speciesPhaseMatrix);
    console.log(matrix);

    data.speciesPhaseMatrix.forEach(function(d, i) {
      d.forEach(function(e, j) {
        matrix[i][n + j] = matrix[n + j][i] = Math.abs(e);
      });
    });

    console.log(data.speciesPhaseMatrix);
    console.log(matrix);

    function zero2D(rows, cols) {
      var array = [], row = [];
      while (cols--) row.push(0);
      while (rows--) array.push(row.slice());
      return array;
    }

    var outerRadius = Math.min(width, height) * 0.5 - 40,
        innerRadius = outerRadius * 0.9;

    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    var color = d3.scaleOrdinal()
        .domain(d3.range(matrix.length))
        .range(["#000000", "#FFDD89", "#957244", "#F26223", "#446"]);

    return {
      chord: chord,
      arc: arc,
      ribbon: ribbon,
      color: color
    };
*/
  }

  function draw() {
    // Pie layout for phase and species arcs
    var pie = d3.pie()
        .value(function() { return 1; })
        .padAngle(0.04);

    // Arc generator for phase and species arcs
    // XXX: SVG width seem to be a bit wider than container width. Maybe an
    // issue with margins. Need to look into this.
    var radius = Math.min(width, height) / 2 - 20;
    var arc = d3.arc()
        .cornerRadius(5)
        .outerRadius(radius)
        .innerRadius(radius - 40);

    // Set width and height
    svg .attr("width", width)
        .attr("height", height)
      .select("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    drawPhases();
    drawSpecies();
    drawChords();

    function drawPhases() {
      // Set to upper half of pie layout
      pie .startAngle(-Math.PI / 2)
          .endAngle(Math.PI / 2);

      // Bind phase data
      var phase = svg.select(".arcs").selectAll(".phase")
          .data(pie(data.phases));

      // Enter
      var phaseEnter = phase.enter().append("g")
          .attr("class", "phase")
          .on("click", function(d) {
            dispatcher.call("selectPhase", this, "Phase: " + d.data.name);
          })
          .on("mouseover", function() {
            d3.select(this).select("path")
                .style("stroke-width", 2);

            d3.select(this).select("text")
                .style("font-weight", "bold");
          })
          .on("mouseout", function() {
            d3.select(this).select("path")
                .style("stroke-width", null);

            d3.select(this).select("text")
                .style("font-weight", null);
          });

      phaseEnter.append("path")
          .attr("d", arc)
          .style("fill", "white")
          .style("stroke", "white");

      phaseEnter.append("text")
          .text(function(d) { return d.data.name; })
          .attr("class", "arcLabel")
          .attr("transform", arcTextTransform)
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("fill", "white")
          .style("stroke", "none")
          .style("pointer-events", "none");

      // Enter + update
      var phaseMerge = phaseEnter.merge(phase);

      phaseMerge.select("path")
          .style("stroke", "black")
          .attr("d", arc);

      phaseMerge.select("text")
          .style("fill", "black")
          .attr("transform", arcTextTransform)

      // Exit
      phase.exit().remove();
    }

    function drawSpecies() {
      // Set to upper half of pie layout
      pie .startAngle(3 * Math.PI / 2)
          .endAngle(Math.PI / 2);

      // Bind species data
      var species = svg.select(".arcs").selectAll(".species")
          .data(pie(data.species));

      // Enter
      var speciesEnter = species.enter().append("g")
          .attr("class", "species")
          .on("click", function(d) {
            dispatcher.call("selectSpecies", this, "Species: " + d.data.name);
          })
          .on("mouseover", function() {
            d3.select(this).select("path")
                .style("stroke-width", 2);

            d3.select(this).select("text")
                .style("font-weight", "bold");
          })
          .on("mouseout", function() {
            d3.select(this).select("path")
                .style("stroke-width", null);

            d3.select(this).select("text")
                .style("font-weight", null);
          });

      speciesEnter.append("path")
          .style("fill", "white")
          .style("stroke", "white")
          .attr("d", arc);

      speciesEnter.append("text")
          .text(function(d) { return d.data.name; })
          .attr("class", "arcLabel")
          .attr("transform", arcTextTransform)
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("fill", "white")
          .style("stroke", "none")
          .style("pointer-events", "none");

      // Enter + update
      var speciesMerge = speciesEnter.merge(species);

      speciesMerge.select("path")
          .style("stroke", "black")
          .attr("d", arc);

      speciesMerge.select("text")
          .style("fill", "black")
          .attr("transform", arcTextTransform)

      // Exit
      species.exit().remove();
    }

    function arcTextTransform(d) {
      var angle = ((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90);

      return "translate(" + arc.centroid(d) + ")" +
             "rotate(" + (angle > 0 ? -90 : 90) + ")" +
             "rotate(" + angle + ")";
    }

    function drawChords() {

    }
  }

  chordMap.update = function() {
    doLayout();
    draw();
  };

  chordMap.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chordMap;
  };

  chordMap.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chordMap;
  };

  // For registering event callbacks
  chordMap.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? chordMap : value;
  };

  // Initialize event callbacks
  chordMap.selectPhase = function(_) {
    console.log(_);
    return chordMap;
  };

  chordMap.selectSpecies = function(_) {
    console.log(_);
    return chordMap;
  };

  chordMap.on("selectPhase", chordMap.selectPhase);
  chordMap.on("selectSpecies", chordMap.selectSpecies);

  return chordMap;
}
