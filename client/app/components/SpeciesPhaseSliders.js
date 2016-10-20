var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

function SpeciesPhaseSliders(props) {
  var sliders = props.species.map(function (species, i) {
    function handleChange(value) {
      props.onChange({
        species: species,
        value: value
      });
    };

    return (
      <SliderContainer
        key={i}
        label={species.name}
        min={species.min}
        max={species.max}
        initialValue={species.value}
        onChange={handleChange} />
    );
  });

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Species-phase interactions</h3>
      </div>
      <div className="panel-body">
        {sliders}
      </div>
    </div>
  );
}

SpeciesPhaseSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.object).isRequired,
  phases: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
