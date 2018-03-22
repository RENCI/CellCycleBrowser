var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var HeatMap = require("../visualizations/HeatMap");
var d3 = require("d3");

class HeatMapContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.heatMap = HeatMap();

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

  componentWillUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  onResize() {
    this.resize();
  }

  drawVisualization(props, state) {
    // Set up heat map
    this.heatMap
        .width(this.getNode().clientWidth)
        .height(props.height)
        .dataExtent(props.dataExtent)
        .timeExtent(props.timeExtent)
        .phases(props.phases)
        .phaseColorScale(props.phaseColorScale)
        .phaseOverlayOpacity(props.phaseOverlayOpacity);

    // Draw heat map
    d3.select(this.getNode())
        .datum(props.data)
        .call(this.heatMap);
  }

  resize() {
    this.drawVisualization(this.props, this.state);
  }

  getNode() {
    return ReactDOM.findDOMNode(this);
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

HeatMapContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  dataExtent: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number),
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

module.exports = HeatMapContainer;
