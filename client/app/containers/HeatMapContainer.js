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
    return d3.scaleSequential(d3ScaleChromatic.interpolateBuGn)
        .domain(d3.extent(d3.merge(data)));
}

var HeatMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    alignment: PropTypes.string.isRequired
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
      alignment: this.props.alignment
    };
  },
  componentWillUnmount: function() {
    HeatMap.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    var style = {
      height: this.props.data.length * 20,
      borderLeft: "2px solid #ddd",
      borderTop: "2px solid #ddd"
    };

    return <div className="heatMap" style={style}></div>
  }
});

module.exports = HeatMapContainer;