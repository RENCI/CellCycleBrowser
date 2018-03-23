var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var ViewActionCreators = require("../actions/ViewActionCreators");
var PhaseMap = require("../visualizations/PhaseMap");
var d3 = require("d3");

class PhaseMapContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.phaseMap = PhaseMap()
        .on("selectTrajectory", this.handleSelectTrajectory);

    // Need to bind this to callback functions here
    this.onResize = this.onResize.bind(this);
    this.handleSelectTrajectory = this.handleSelectTrajectory.bind(this);
  }

  componentDidMount() {
    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  onResize() {
    this.resize();
  }

  drawVisualization(props, state) {
    // Set up phase map
    this.phaseMap
        .height(props.height)
        .colorScale(props.colorScale)
        .timeExtent(props.timeExtent)
        .activeIndex(props.activeIndex)
        .drawLabels(props.isAverage)
        .alignment(props.alignment);

    // Draw phase map
    d3.select(this.getNode())
        .datum(props.data)
        .call(this.phaseMap);
  }

  resize() {
    var width = this.getNode().clientWidth;

    this.phaseMap.width(width);

    this.drawVisualization(this.props, this.state);
  }

  getNode() {
    return ReactDOM.findDOMNode(this);
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
      height: this.props.height
    };

    return <div style={style}></div>
  }
}

PhaseMapContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number),
  activeIndex: PropTypes.string.isRequired,
  colorScale: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  isAverage: PropTypes.bool,
  alignment: PropTypes.string.isRequired
};

PhaseMapContainer.defaultProps = {
  isAverage: false
};

module.exports = PhaseMapContainer;
