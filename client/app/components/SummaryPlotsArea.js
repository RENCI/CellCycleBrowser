var React = require("react");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

function SummaryPlotsArea(props) {
  return (
    <div>
      <h2>Summary Plots</h2>
      <GrowthCurveArea />
      <DistributionArea />
    </div>
  );
}

module.exports = SummaryPlotsArea;
