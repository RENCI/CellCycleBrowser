var React = require("react");
var MapControls = require("../components/MapControls");
var DistributionContainer = require("../containers/DistributionContainer");

function DistributionArea(props) {
  return (
    <div>
      <h3>Cell Cycle Distribution</h3>
      <DistributionContainer />
    </div>
  );
}

module.exports = DistributionArea;
