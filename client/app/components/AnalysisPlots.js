var React = require("react");
var PropTypes = require("prop-types");
var VisualizationWrapper = require("./VisualizationWrapper");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var VisualizationContainer = require("../containers/VisualizationContainer");

var areaStyle = {
  marginBottom: 10
};

function component(plot, i, a) {
  return (
    <div key={i} style={i < a.length - 1 ? areaStyle : null}>
      <VisualizationWrapper>
        <InformationHoverContainer>
          {plot.info}
        </InformationHoverContainer>
        <SaveSvgButtonContainer />
        <VisualizationContainer>
          {plot.component}
        </VisualizationContainer>
      </VisualizationWrapper>
    </div>
  );
}

function AnalysisPlots(props) {
  var plots = props.plots.filter(function (plot) {
    return plot.selected;
  });

  return (
    <div>
      {plots.map(component)}
    </div>
  );
}

AnalysisPlots.propsTypes = {
  plots: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = AnalysisPlots;
