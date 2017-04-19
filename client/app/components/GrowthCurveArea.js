var React = require("react");
var MapControls = require("../components/MapControls");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");

function GrowthCurveArea(props) {
  return (
    <div>
      <h3>Growth Curve</h3>
      <GrowthCurveContainer />
    </div>
  );
}

module.exports = GrowthCurveArea;
