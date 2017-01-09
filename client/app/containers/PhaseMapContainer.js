var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var PhaseMap = require("../visualizations/PhaseMap");

function colorScale(data) {
  // TODO: Move to global settings somewhere
  return d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(data[0].map(function(d) { return d.name; }));
}

var PhaseMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    alignment: PropTypes.string.isRequired
  },
  componentDidMount: function() {
    PhaseMap.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    PhaseMap.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      data: this.props.data,
      colorScale: colorScale(this.props.data),
      timeExtent: this.props.timeExtent,
      alignment: this.props.alignment
    };
  },
  componentWillUnmount: function() {
    PhaseMap.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    // Style needs to be defined here to access data length
    var style = {
      height: this.props.data.length * 20,
      borderLeft: "2px solid #ddd",
      backgroundColor: "#eee"
    };

    return <div className="phaseMap" style={style}></div>
  }
});

module.exports = PhaseMapContainer;
