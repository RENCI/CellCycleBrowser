var React = require("react");
var PropTypes = React.PropTypes;
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

function SummaryPlotsArea(props) {
  return (
    <div>
      {props.hasDatasets ?
        <div style={{marginBottom: 10}}>
          <GrowthCurveArea />
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
