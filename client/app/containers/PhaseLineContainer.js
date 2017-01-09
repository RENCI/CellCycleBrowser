var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var PhaseLine = require("../visualizations/PhaseLine");

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
  // TODO: Move to global settings somewhere
  return d3.scaleOrdinal(d3ScaleChromatic.schemeAccent.slice(1))
      .domain(data[0].map(function(d) { return d.name; }));
}

function averageData(data, alignment) {
  var average = [];

  data.forEach(function(trajectory, i) {
    trajectory.forEach(function(phase, j) {
      if (i === 0) {
        average.push({
          name: phase.name,
          start: 0,
          stop: 0
        });
      }

      average[j].start += phase.start;
      average[j].stop += phase.stop;
    });
  });

  average.forEach(function(phase) {
    phase.start /= data.length;
    phase.stop /= data.length;
  });

  return average;
}

var PhaseLineContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    alignment: PropTypes.string.isRequired
  },
  componentDidMount: function() {
    PhaseLine.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    PhaseLine.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      data: averageData(this.props.data, this.props.alignment),
      colorScale: colorScale(this.props.data),
      timeExtent: this.props.timeExtent,
      alignment: this.props.alignment
    };
  },
  componentWillUnmount: function() {
    PhaseLine.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="phaseLine" style={style}></div>
  }
});

module.exports = PhaseLineContainer;
