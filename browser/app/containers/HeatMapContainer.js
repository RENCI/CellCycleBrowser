var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var HeatMap = require("../visualizations/HeatMap");

function colorScale(data) {
  return d3.scaleQuantize()
      .domain([
        d3.min(data, function(d) {
          return d3.min(d);
        }),
        d3.max(data, function(d) {
          return d3.max(d);
        })])
      //.range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
      //.range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]);
      .range(["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"]);
}

var HeatMapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  },
  componentDidMount: function() {
    HeatMap.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: 300
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
      colorScale: colorScale(this.props.data)
    };
  },
  componentWillUnmount: function() {
    HeatMap.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="heatMap"></div>
  }
});

module.exports = HeatMapContainer;
