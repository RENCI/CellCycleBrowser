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

function SpeciesValueSliders(props) {
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

  var collapseId = "speciesValueSliders";

  return (
    <div className="panel panel-default">
      <button
        type="button"
        className="btn btn-info"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Species initial values
      </button>
      <div className="in" id={collapseId} style={divStyle}>
        {sliders}
      </div>
    </div>
  );
}

SpeciesValueSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesValueSliders;