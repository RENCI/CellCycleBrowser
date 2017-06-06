var React = require("react");
var PropTypes = React.PropTypes;

var areaStyle = {
  marginBottom: 10
};

function component(plot, i, a) {
  return (
    <div key={i} style={i < a.length - 1 ? areaStyle : null}>
      {plot.component}
    </div>
  );
}

function SummaryPlots(props) {
  var plots = props.summaryPlots.filter(function (plot) {
    return plot.selected;
  });

  return (
    <div>
      {plots.map(component)}
    </div>
  );
}

SummaryPlots.propsTypes = {
  summaryPlots: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = SummaryPlots;
