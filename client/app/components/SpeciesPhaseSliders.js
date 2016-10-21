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

  var collapseId = "speciesPhaseSliders";

  return (
    <div className="panel panel-default">
      <button
        type="button"
        className="btn btn-info"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Species→phase interactions
      </button>
      <div className="in" id={collapseId} style={divStyle}>
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
