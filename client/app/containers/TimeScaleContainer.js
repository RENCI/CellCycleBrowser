var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var TimeScale = require("../visualizations/TimeScale");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5,
  marginTop: 10,
  marginBottom: 10
};

var timeScale = TimeScale();

var TimeScaleContainer = React.createClass ({
  propTypes: {
    timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired
  },
  componentDidMount: function() {
    timeScale.on("selectTime", this.handleSelectTime);

    this.resize();

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
    }.bind(this));
  },
  componentWillUpdate: function (props, state) {
    this.drawTimeScale(props.timeExtent);

    return false;
  },
  onResize: function () {
    this.resize();
  },
  drawTimeScale: function (timeExtent) {
    if (!timeExtent) return;

    d3.select(this.getNode())
        .datum(timeExtent)
        .call(timeScale);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    timeScale
        .width(width)
        .height(50);

    this.drawTimeScale(this.props.timeExtent);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  handleSelectTime: function (time) {
    timeScale.selectTime(time);
  },
  render: function () {
    return <div className="TimeScale" style={divStyle}></div>
  }
});

module.exports = TimeScaleContainer;
