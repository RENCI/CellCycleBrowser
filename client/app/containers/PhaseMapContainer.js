var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ViewActionCreators = require("../actions/ViewActionCreators");
var PhaseMap = require("../visualizations/PhaseMap");
var d3 = require("d3");

var PhaseMapContainer = React.createClass({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    activeIndex: PropTypes.string.isRequired,
    activePhase: PropTypes.string.isRequired,
    colorScale: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    isAverage: PropTypes.bool
  },
  getDefautProps: {
    isAverage: false
  },
  componentDidMount: function () {
    // Create visualization function
    this.phaseMap = PhaseMap()
        .on("selectTrajectory", this.handleSelectTrajectory)
        .on("selectPhase", this.handleSelectPhase);

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onPhaseColorChange: function () {
    this.setState(getStateFromPhaseColorStore());
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (props, state) {
    // Set up phase map
    this.phaseMap
        .height(props.height)
        .colorScale(props.colorScale)
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

    this.drawVisualization(this.props, this.state);
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
    // Create style here to update height and avoid mutated style warning
    var style = {
      backgroundColor: "#eee",
      height: this.props.height
    };

    return <div style={style}></div>
  }
});

module.exports = PhaseMapContainer;
