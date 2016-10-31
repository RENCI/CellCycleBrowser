var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

var buttonStyle = {
  width: "100%"
}

var divStyle = {
  marginLeft: 10,
  marginRight: 10
}

function handleTrajectoryChange(e) {
  console.log(e);
}

function SimulationParameterSliders(props) {
  var collapseId = "modelParameterSliders";

  return (
    <div className="panel panel-default">
      <button
        type="button"
        className="btn btn-info"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Simulation parameters
      </button>
      <div className="in" id={collapseId} style={divStyle}>
        <SliderContainer
          label={"Number of trajectories"}
          min={1}
          max={20}
          step={1}
          initialValue={1}
          onChange={handleTrajectoryChange} />
      </div>
    </div>
  );
}

module.exports = SimulationParameterSliders;
