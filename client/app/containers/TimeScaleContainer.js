var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var TimeScale = require("../visualizations/TimeScale");
var d3 = require("d3");

var divStyle = {
  borderLeftColor: "#ddd",
  borderLeftStyle: "solid",
  borderLeftWidth: "2px",
  paddingBottom: 0
};

var TimeScaleContainer = React.createClass ({
  propTypes: {
    timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired
  },
  componentDidMount: function() {
    // Create visualization function
    this.timeScale = TimeScale()
        .height(45);

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props.timeExtent);

    return false;
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (timeExtent) {
    if (!timeExtent) return;

    // Draw time scale
    d3.select(this.getNode())
        .datum(timeExtent)
        .call(this.timeScale);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.timeScale.width(width);

    this.drawVisualization(this.props.timeExtent);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function () {
    return <div style={divStyle}></div>
  }
});

module.exports = TimeScaleContainer;
