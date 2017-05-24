var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var SliderContainer = require("../containers/SliderContainer");

function SpeciesValueSliders(props) {
  var sliders = props.species.map(function (species, i) {
    function handleChange(value) {
      props.onChange({
        species: species,
        value: value
      });
    };

    var value = props.values[species];

    return (
      <SliderContainer
        key={i}
        label={species}
        min={value.min}
        max={value.max}
        initialValue={value.value}
        onChange={handleChange} />
    );
  });

  return (
    <Collapsible
      id="speciesValueSliders"
      label="Species initial values">
        {sliders}
    </Collapsible>
  );
}

SpeciesValueSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesValueSliders;
