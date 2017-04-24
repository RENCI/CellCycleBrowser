var React = require("react");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

function SummaryPlotsArea(props) {
  return (
    <div>
      <GrowthCurveArea />
      <DistributionArea />
    </div>
  );
}

module.exports = SummaryPlotsArea;
