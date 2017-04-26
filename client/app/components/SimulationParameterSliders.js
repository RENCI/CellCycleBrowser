var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

var panelStyle = {
  marginBottom: 10
};

var buttonStyle = {
  width: "100%",
  marginTop: -1
};

var collapseStyle = {
  marginLeft: 10,
  marginRight: 10
};

function SimulationParameterSliders(props) {
  var sliders = props.parameters.map(function (parameter, i) {
    function handleChange(value) {
      props.onChange({
        parameter: parameter.name,
        value: value
      });
    }

    return (
      <SliderContainer
        key={i}
        label={parameter.label}
        min={parameter.min}
        max={parameter.max}
        step={1}
        initialValue={parameter.value}
        onChange={handleChange} />
    );
  });

  var collapseId = "modelParameterSliders";

  return (
    <div className="panel panel-default" style={panelStyle}>
      <button
        type="button"
        className="btn btn-default"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Simulation parameters
      </button>
      <div className="in" id={collapseId} style={collapseStyle}>
        {sliders}
      </div>
    </div>
  );
}

SimulationParameterSliders.propTypes = {
  parameters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SimulationParameterSliders;
