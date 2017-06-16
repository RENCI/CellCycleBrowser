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

function AnalysisPlots(props) {
  var plots = props.AnalysisPlots.filter(function (plot) {
    return plot.selected;
  });

  return (
    <div>
      {plots.map(component)}
    </div>
  );
}

AnalysisPlots.propsTypes = {
  AnalysisPlots: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = AnalysisPlots;
