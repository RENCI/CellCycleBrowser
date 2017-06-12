var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");

var divStyle = {
  marginTop: 10
};

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
      <ValueSliderContainer
        key={i}
        label={species}
        min={value.min}
        max={value.max}
        value={value.value}
        onChange={handleChange} />
    );
  });

  return (
    <Collapsible
      id="speciesValueSliders"
      label="Expression levels">
        <div style={divStyle}>
          {sliders}
        </div>
    </Collapsible>
  );
}

SpeciesValueSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesValueSliders;
