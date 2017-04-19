var React = require("react");
var GrowthCurveArea = require("../components/GrowthCurveArea")

function SummaryPlotsArea(props) {
  return (
    <div>
      <h2>Summary Plots</h2>
      <GrowthCurveArea />
    </div>
  );
}

module.exports = SummaryPlotsArea;
