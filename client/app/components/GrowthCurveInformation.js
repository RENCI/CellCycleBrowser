var React = require("react");
var InformationWrapper = require("./InformationWrapper");

function GrowthCurveInformation() {
  return (
    <InformationWrapper>
      <h4>Growth Curve Analysis Plot</h4>
      <p>This plot shows a growth curve for each data <b>source</b> represented in the <i>Data Browser</i>, based on the average trace length for that source. The color for each source matches the <i>Source color</i> icons for each track in the <i>Data Browser</i>.</p>
    </InformationWrapper>
  );
}

module.exports = GrowthCurveInformation;
