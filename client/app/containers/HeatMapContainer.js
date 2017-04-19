var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var HeatMap = require("../visualizations/HeatMap");

var HeatMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    dataExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    activePhase: PropTypes.string.isRequired,
    phaseColorScale: PropTypes.func.isRequired,
    phaseOverlayOpacity: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  },
  componentDidMount: function() {
    // Create visualiztion function
    this.heatMap = HeatMap();

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (props, state) {
    // Set up heat map
    this.heatMap
        .height(props.height)
        .dataExtent(props.dataExtent)
        .timeExtent(props.timeExtent)
        .phases(props.phases)
        .phaseColorScale(props.phaseColorScale)
        .activePhase(props.activePhase)
        .phaseOverlayOpacity(props.phaseOverlayOpacity);

    // Draw heat map
    d3.select(this.getNode())
        .datum(props.data)
        .call(this.heatMap);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.heatMap.width(width);

    this.drawVisualization(this.props, this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      borderLeft: "2px solid #ddd",
      backgroundColor: "#eee",
      height: this.props.height
    };

    return <div style={style}></div>
  }
});

module.exports = HeatMapContainer;
