var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var HeatLine = require("../visualizations/HeatLine");

// TODO: Magic number for height. Percentage doesn't work, perhaps read
// from container element?
var style = {
  height: 34,
  borderLeft: "2px solid #ddd",
  backgroundColor: "#eee"
};

// TODO: Use a shared range/sequence for line and heat maps. Perhaps refactor
// to include a SpeciesVisualizationContainer that handles this.
function colorScale(data) {
  // TODO: Currently normalizing per heatmap. Might want this to be global
  // across all heatmaps
/*
  return d3.scaleQuantize()
      .domain(d3.extent(d3.merge(data)))
      //.range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
      //.range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]);
      .range(["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"]);
*/
/*
  return d3.scaleSequential(d3ScaleChromatic.interpolateBuGn)
      .domain(d3.extent(d3.merge(data), function(d) { return d.value; }));
*/
/*
  var extent = d3.extent(d3.merge(data), function(d) { return d.value; });

  return phases.length > 0 ?
    d3.scaleThreshold()
        .domain(phases.map(function(d) {
          return d.stop;
        }))
        .range([
          d3.scaleSequential(d3ScaleChromatic.interpolateGreens)
              .domain(extent),
          d3.scaleSequential(d3ScaleChromatic.interpolatePurples)
              .domain(extent),
          d3.scaleSequential(d3ScaleChromatic.interpolateOranges)
              .domain(extent),
          d3.scaleLinear()
              .domain(extent)
              .range(["white", "black"])
        ])
    :
    d3.scaleLinear()
        .domain(extent)
        .range(["white", "black"]);
*/
  return d3.scaleLinear()
      .domain(d3.extent(d3.merge(data).filter(function(d) {
        return d.value > -1;
      }), function(d) { return d.value; }))
      .range(["white", "black"]);
}

function phaseColorScale(phases) {
  return d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(phases.map(function(d) { return d.name; }));
}

function averageData(data, alignment) {
  var timeExtent = d3.extent(d3.merge(data), function(d) { return d.start; });

  var shiftData = data.map(function(d) {
    var valid = d.map(function(d) { return d.value >= 0; });

    var first = d[valid.indexOf(true)].start;
    var last = d[valid.lastIndexOf(true)].start;

    return d.map(function(d) {
      return alignment === "left" ?
             { value: d.value, start: d.start - (first - timeExtent[0]) } :
             { value: d.value, start: d.start + (timeExtent[1] - last) }
    });
  });

  // Get the average time step
  var averageTimeStep = d3.mean(d3.merge(data.map(function(d) {
    return d3.pairs(d).map(function(d) { return d[1].start - d[0].start; });
  })));

  // Generate time steps
  var timeRange = d3.extent(d3.merge(shiftData), function(d) { return d.start; });
  var timeSteps = d3.range(timeRange[0], timeRange[1] + averageTimeStep, averageTimeStep);

  // Keep track of time step per array
  var t = shiftData.map(function() { return 0; });

  return timeSteps.map(function(timeStep) {
    var value = 0;
    var count = 0;

    shiftData.forEach(function(d, i) {
      if (t[i] === d.length - 1) return;

      // Find closest time step
      var closest = {
        index: t[i],
        distance: Math.abs(d[t[i]].start - timeStep)
      };

      for (var j = t[i] + 1; j < d.length; j++) {
        var distance = Math.abs(d[j].start - timeStep);

        if (distance > closest.distance) {
          break;
        }
        else {
          closest.index = j;
          closest.distance = distance;
        }
      }

      var v = d[closest.index].value;

      // XXX: Hack using timeStep comparison here. Should check for
      // overlapping regions, or perhaps do a weighted average
      if (v >= 0 && closest.distance <= timeStep) {
        value += v;
        count++;
      }

      t[i] = closest.index;
    });

    return {
      value: count > 0 ? value / count : 0,
      start: timeStep,
      stop: timeStep + averageTimeStep,
    };
  });
}

var HeatLineContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    phases: PropTypes.arrayOf(PropTypes.object).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    alignment: PropTypes.string.isRequired,
    activePhase: PropTypes.string.isRequired,
    phaseOverlayOpacity: PropTypes.number.isRequired
  },
  componentDidMount: function() {
    HeatLine.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    HeatLine.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    var average = averageData(this.props.data, this.props.alignment);

    return {
      data: average,
      colorScale: colorScale(this.props.data),
      phases: this.props.phases,
      phaseColorScale: phaseColorScale(this.props.phases),
      timeExtent: this.props.timeExtent,
      alignment: this.props.alignment,
      activePhase: this.props.activePhase,
      phaseOverlayOpacity: this.props.phaseOverlayOpacity
    };
  },
  componentWillUnmount: function() {
    HeatLine.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="heatLine" style={style}></div>
  }
});

module.exports = HeatLineContainer;
