var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

function handleTrajectoryChange(e) {
  console.log(e);
}

function ModelParameterSliders(props) {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Model parameters</h3>
      </div>
      <div className="panel-body">
        <SliderContainer
          label={"Number of trajectories"}
          min={1}
          max={20}
          initialValue={1}
          onChange={handleTrajectoryChange} />
        </div>
    </div>
  );
}

module.exports = ModelParameterSliders;
