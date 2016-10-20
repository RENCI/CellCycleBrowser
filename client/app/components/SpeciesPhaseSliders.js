var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

function SpeciesPhaseSliders(props) {
  var sliders = [];
  props.model.species.forEach(function(species, i) {
    props.model.phases.forEach(function(phase, j) {
      function handleChange(value) {
        props.onChange({
          species: species,
          phase: phase,
          value: value
        });
      }

      sliders.push (
        <SliderContainer
          key={i * props.model.phases.length + j}
          label={species.name + "→" + phase.name}
          min={-1}
          max={1}
          initialValue={props.model.speciesPhaseMatrix[i][j]}
          onChange={handleChange} />
      );
    });
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
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
