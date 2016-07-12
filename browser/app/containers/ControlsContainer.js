var React = require("react");
var PropTypes = React.PropTypes;
var Controls = require("../components/Controls");

var ControlsContainer = React.createClass ({
  render: function () {
    return (
      <div>
        <h2>Controls</h2>
        <Controls />
      </div>
    );
  }
});

module.exports = ControlsContainer;
