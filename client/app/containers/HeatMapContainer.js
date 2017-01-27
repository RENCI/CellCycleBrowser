var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var HeatMap = require("../visualizations/HeatMap");

function colorScale(data) {
  // TODO: Currently normalizing per heatmap. Might want this to be global
  // across all heatmaps
/*
  return d3.scaleQuantize()
      .domain(d3.extent(d3.merge(data)))
      //.range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
      //.range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]);
      .range(["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"]);
*/
/*
  return d3.scaleSequential(d3ScaleChromatic.interpolateBuGn)
        .domain(d3.extent(d3.merge(data), function(d) { return d.value; }));
*/
/*
  var extent = d3.extent(d3.merge(data), function(d) { return d.value; });

  return phases[0].length > 0 ?
    data.map(function(d, i) {
      return d3.scaleThreshold()
          .domain(phases[i].map(function(d) {
            return d.stop;
          }))
          .range([
            d3.scaleSequential(d3ScaleChromatic.interpolateGreens)
                .domain(extent),
            d3.scaleSequential(d3ScaleChromatic.interpolatePurples)
                .domain(extent),
            d3.scaleSequential(d3ScaleChromatic.interpolateOranges)
                .domain(extent),
            d3.scaleLinear()
                .domain(extent)
                .range(["white", "black"])
          ]);
    })
    :
    d3.scaleLinear()
        .domain(extent)
        .range(["white", "black"]);
*/

  return d3.scaleLinear()
      .domain(d3.extent(d3.merge(data).filter(function(d) {
        return d.value > -1;
      }), function(d) { return d.value; }))
      .range(["white", "black"]);
}

function phaseColorScale(phases) {
  return d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(phases[0].map(function(d) { return d.name; }));
}

var HeatMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number),
    alignment: PropTypes.string.isRequired,
    activePhase: PropTypes.string.isRequired,
    phaseOverlayOpacity: PropTypes.number.isRequired
  },
  componentDidMount: function() {
    HeatMap.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    HeatMap.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      data: this.props.data,
      colorScale: colorScale(this.props.data),
      phases: this.props.phases,
      phaseColorScale: phaseColorScale(this.props.phases),
      timeExtent: this.props.timeExtent,
      alignment: this.props.alignment,
      activePhase: this.props.activePhase,
      phaseOverlayOpacity: this.props.phaseOverlayOpacity
    };
  },
  componentWillUnmount: function() {
    HeatMap.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    // Style needs to be defined here to access data length
    var style = {
      height: this.props.data.length * 20,
      borderLeft: "2px solid #ddd",
      backgroundColor: "#eee"
    };

    return <div className="heatMap" style={style}></div>
  }
});

module.exports = HeatMapContainer;
