var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var HeatLine = require("../visualizations/HeatLine");

// TODO: Magic number for height. Percentage doesn't work, perhaps read
// from container element?
var style = {
  height: 34,
  borderLeft: "2px solid #ddd"
};

// TODO: Use a shared range/sequence for line and heat maps. Perhaps refactor
// to include a SpeciesVisualizationContainer that handles this.
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

function averageData(data, alignment) {
  var maxLength = d3.max(data, function(d) { return d.length; });

  var average = [];
  average.length = maxLength;

  for (var i = 0; i < maxLength; i++) {
    average[i] = 0;
    var count = 0;

    for (var j = 0; j < data.length; j++) {
      var d = data[j],
          offset = alignment === "right" ? maxLength - d.length : 0,
          i2 = i - offset;

      if (i2 >= 0 && i2 < d.length) {
        average[i] += d[i2];
        count++;
      }
    }

    average[i] /= count;
  }

  return average;
}

var HeatLineContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    alignment: PropTypes.string.isRequired
  },
  componentDidMount: function() {
    HeatLine.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "100%"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    HeatLine.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    var average = averageData(this.props.data, this.props.alignment);

    return {
      data: average,
      colorScale: colorScale(this.props.data),
      alignment: this.props.alignment
    };
  },
  componentWillUnmount: function() {
    HeatLine.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="heatLine" style={style}></div>
  }
});

module.exports = HeatLineContainer;