var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var TimeScale = require("../visualizations/TimeScale");
var d3 = require("d3");

class TimeScaleContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.timeScale = TimeScale()
        .height(25);

    // Need to bind this to callback functions here
    this.onResize = this.onResize.bind(this);
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
    this.drawVisualization(props);

    return false;
  }

  onResize() {
    this.resize();
  }

  drawVisualization(props) {
    if (!props.timeExtent) return;

    this.timeScale
        .width(this.getNode().clientWidth)
        .alignment(props.alignment);

    // Draw time scale
    d3.select(this.getNode())
        .datum(props.timeExtent)
        .call(this.timeScale);
  }

  resize() {
    this.drawVisualization(this.props);
  }

  getNode() {
    return ReactDOM.findDOMNode(this);
  }

  render() {
    return <div></div>
  }
}

TimeScaleContainer.propTypes = {
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  alignment: PropTypes.string.isRequired
};

module.exports = TimeScaleContainer;
