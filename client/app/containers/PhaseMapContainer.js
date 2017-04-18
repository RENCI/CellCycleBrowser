var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var PhaseColorStore = require("../stores/PhaseColorStore");
var ViewActionCreators = require("../actions/ViewActionCreators");
var PhaseMap = require("../visualizations/PhaseMap");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

// TODO: Move to css file
var style = {
  borderLeft: "2px solid #ddd",
  backgroundColor: "#eee"
};

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
    // Create visualization function
    this.phaseMap = PhaseMap()
        .on("selectTrajectory", this.handleSelectTrajectory)
        .on("selectPhase", this.handleSelectPhase);

    PhaseColorStore.addChangeListener(this.onPhaseColorChange);

    this.resize();

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
    }.bind(this));
  },
  componentWillUnmount: function() {
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawPhaseMap(props, state);

    return false;
  },
  onPhaseColorChange: function () {
    this.setState(getStateFromStore());
  },
  onResize: function () {
    this.resize();
  },
  drawPhaseMap: function (props, state) {
    // Set up phase map
    this.phaseMap
        .height(props.height)
        .colorScale(this.state.colorScale)
        .timeExtent(props.timeExtent)
        .activeIndex(props.activeIndex)
        .activePhase(props.activePhase)

    // Draw phase map
    d3.select(this.getNode())
        .datum(props.data)
        .call(this.phaseMap);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.phaseMap.width(width);

    this.drawPhaseMap(this.props, this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  handleSelectTrajectory: function(trajectory) {
    if (this.props.isAverage) {
      trajectory.id = "average";
    }

    ViewActionCreators.selectTrajectory(trajectory);
  },
  handleSelectPhase: function(phase) {
    ViewActionCreators.selectPhase(phase);
  },
  render: function() {
    // Update height
    style.height = this.props.height;

    return <div className="phaseMap" style={style}></div>
  }
});

module.exports = PhaseMapContainer;
