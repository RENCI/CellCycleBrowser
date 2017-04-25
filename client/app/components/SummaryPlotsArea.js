var React = require("react");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

function SummaryPlotsArea(props) {
  return (
    <div>
      <GrowthCurveArea />
      <div style={{height: 10}}></div>
      <DistributionArea />
    </div>
  );
}

module.exports = SummaryPlotsArea;
