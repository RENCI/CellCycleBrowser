var React = require("react");
var PropTypes = React.PropTypes;
var TimeSeriesArea = require("../components/TimeSeriesArea");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

var areaStyle = {
  marginBottom: 10
};

function SummaryPlotsArea(props) {
  return (
    <div>
      {props.hasDatasets ?
        <div>
          <div style={areaStyle}>
            <TimeSeriesArea />
          </div>
          <div style={areaStyle}>
            <GrowthCurveArea />
          </div>
        </div>
        : null}
      {props.hasModels ?
        <DistributionArea />
        : null}
    </div>
  );
}

SummaryPlotsArea.propsTypes = {
  hasModels: PropTypes.bool.isRequired,
  hasDatasets: PropTypes.bool.isRequired
};

module.exports = SummaryPlotsArea;
