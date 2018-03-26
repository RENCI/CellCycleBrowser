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
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props);

    return false;
  }

  drawVisualization(props) {
    if (!props.timeExtent) return;

    this.timeScale
        .width(props.width)
        .alignment(props.alignment);

    // Draw time scale
    d3.select(ReactDOM.findDOMNode(this))
        .datum(props.timeExtent)
        .call(this.timeScale);
  }

  render() {
    return <div></div>
  }
}

TimeScaleContainer.propTypes = {
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  alignment: PropTypes.string.isRequired,
  width: PropTypes.number
};

module.exports = TimeScaleContainer;
