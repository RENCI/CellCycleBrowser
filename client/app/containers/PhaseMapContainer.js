var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var ViewActionCreators = require("../actions/ViewActionCreators");
var PhaseMap = require("../visualizations/PhaseMap");
var d3 = require("d3");

function height(props) {
  return props.rowHeight * props.data.length;
}

class PhaseMapContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.phaseMap = PhaseMap()
        .on("selectTrajectory", this.handleSelectTrajectory);

    // Need to bind this to callback functions here
    this.handleSelectTrajectory = this.handleSelectTrajectory.bind(this);
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  drawVisualization(props, state) {
    // Set up phase map
    this.phaseMap
        .width(props.width)
        .height(height(props))
        .colorScale(props.colorScale)
        .timeExtent(props.timeExtent)
        .activeIndex(props.activeIndex)
        .drawLabels(props.isAverage)
        .alignment(props.alignment);

    // Draw phase map
    d3.select(ReactDOM.findDOMNode(this))
        .datum(props.data)
        .call(this.phaseMap);
  }

  handleSelectTrajectory(trajectory) {
    if (trajectory && this.props.isAverage) {
      trajectory = "average";
    }

    ViewActionCreators.selectTrajectory(trajectory);
  }

  render() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      backgroundColor: "#eee",
      height: height(this.props)
    };

    return <div style={style}></div>
  }
}

PhaseMapContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number),
  activeIndex: PropTypes.string.isRequired,
  colorScale: PropTypes.func.isRequired,
  isAverage: PropTypes.bool,
  alignment: PropTypes.string.isRequired,
  rowHeight: PropTypes.number.isRequired,
  width: PropTypes.number
};

PhaseMapContainer.defaultProps = {
  isAverage: false
};

module.exports = PhaseMapContainer;
