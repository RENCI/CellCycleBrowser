var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var HeatMap = require("../visualizations/HeatMap");
var HeatMapCanvas = require("../visualizations/HeatMapCanvas");
var d3 = require("d3");

function height(props) {
  return props.rowHeight * props.data.length;
}

class HeatMapContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.heatMap = HeatMap();
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  drawVisualization(props, state) {
    // Set up heat map
    this.heatMap
        .width(props.width)
        .height(height(props))
        .dataExtent(props.dataExtent)
        .timeExtent(props.timeExtent)
        .phases(props.phases)
        .phaseColorScale(props.phaseColorScale)
        .phaseOverlayOpacity(props.phaseOverlayOpacity);

    // Draw heat map
    d3.select(this.div)
        .datum(props.data)
        .call(this.heatMap);
  }

  render() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      backgroundColor: "#eee",
      height: height(this.props)
    };

    return <div ref={div => this.div = div} style={style}></div>
  }
}

HeatMapContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  dataExtent: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number),
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  width: PropTypes.number
};

module.exports = HeatMapContainer;
