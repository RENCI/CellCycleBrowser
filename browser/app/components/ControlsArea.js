var React = require("react");
var Controls = require("./Controls");

function ControlsArea(props) {
  return (
    <div>
      <h2>Controls</h2>
      <Controls />
    </div>
  );
}

module.exports = ControlsArea;