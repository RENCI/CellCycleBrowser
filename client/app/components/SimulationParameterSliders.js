var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var SliderContainer = require("../containers/SliderContainer");

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

  return (
    <Collapsible
      id="simulationParameterSliders"
      label="Simulation parameters">
        {sliders}
    </Collapsible>
  );
}

SimulationParameterSliders.propTypes = {
  parameters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SimulationParameterSliders;
