var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var HeatMap = require("../visualizations/HeatMap");

// TODO: Move to css file
var style = {
  borderLeft: "2px solid #ddd",
  backgroundColor: "#eee"
};

function phaseColorScale(phases) {
  return d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(phases[0].map(function(d) { return d.name; }));
}

var HeatMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    dataExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
    phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    activePhase: PropTypes.string.isRequired,
    phaseOverlayOpacity: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  },
  componentDidMount: function() {    
    // Create visualiztion function
    this.heatMap = HeatMap();

    this.resize();

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
    }.bind(this));
  },
  componentWillUpdate: function (props, state) {
    this.drawHeatMap(props, state);

    return false;
  },
  onResize: function () {
    this.resize();
  },
  drawHeatMap: function (props, state) {
    // Set up heat map
    this.heatMap
        .height(props.height)
        .dataExtent(props.dataExtent)
        .timeExtent(props.timeExtent)
        .phases(props.phases)
        .phaseColorScale(phaseColorScale(props.phases))
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

    this.drawHeatMap(this.props, this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function() {
    // Update height
    style.height = this.props.height;

    return <div className="heatMap" style={style}></div>
  }
});

module.exports = HeatMapContainer;
