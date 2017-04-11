var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var PhaseColorStore = require("../stores/PhaseColorStore");
var ViewActionCreators = require("../actions/ViewActionCreators");
var PhaseMap = require("../visualizations/PhaseMap");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    colorScale: PhaseColorStore.getColorScale()
  };
}

var PhaseMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    activeIndex: PropTypes.string.isRequired,
    activePhase: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    isAverage: PropTypes.bool
  },
  getDefautProps: {
    isAverage: false
  },
  getInitialState: function () {
    return {
      colorScale: PhaseColorStore.getColorScale()
    };
  },
  componentDidMount: function() {
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);

    PhaseMap.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  onPhaseColorChange: function () {
    this.setState(getStateFromStore());
  },
  componentWillUnmount: function() {
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
  },
  componentDidUpdate: function() {
    PhaseMap.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      data: this.props.data,
      colorScale: this.state.colorScale,
      timeExtent: this.props.timeExtent,
      activeIndex: this.props.activeIndex,
      activePhase: this.props.activePhase,
      selectTrajectory: this.selectTrajectory,
      selectPhase: this.selectPhase
    };
  },
  componentWillUnmount: function() {
    PhaseMap.destroy(ReactDOM.findDOMNode(this));
  },
  selectTrajectory: function(trajectory) {
    if (this.props.isAverage) {
      trajectory.id = "average";
    }

    ViewActionCreators.selectTrajectory(trajectory);
  },
  selectPhase: function(phase) {
    ViewActionCreators.selectPhase(phase);
  },
  render: function() {
    // Style needs to be defined here to access data length
    var style = {
      height: this.props.height,
      borderLeft: "2px solid #ddd",
      backgroundColor: "#eee"
    };

    return <div className="phaseMap" style={style}></div>
  }
});

module.exports = PhaseMapContainer;
