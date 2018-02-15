var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var TimeScale = require("../visualizations/TimeScale");
var d3 = require("d3");

var TimeScaleContainer = React.createClass ({
  propTypes: {
    timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
    alignment: PropTypes.string.isRequired
  },
  getInitialState: function () {
    // Create visualization function
    this.timeScale = TimeScale()
        .height(25);

    return null;
  },
  componentDidMount: function () {
    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    window.removeEventListener("resize", this.onResize);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props);

    return false;
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (props) {
    if (!props.timeExtent) return;

    this.timeScale
        .width(this.getNode().clientWidth)
        .alignment(props.alignment);

    // Draw time scale
    d3.select(this.getNode())
        .datum(props.timeExtent)
        .call(this.timeScale);
  },
  resize: function () {
    this.drawVisualization(this.props);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function () {
    return <div></div>
  }
});

module.exports = TimeScaleContainer;
