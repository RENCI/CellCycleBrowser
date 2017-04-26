var React = require("react");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

var panelStyle = {
  marginBottom: 10
};

var buttonStyle = {
  width: "100%",
  marginTop: -1
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

  var collapseId = "speciesValueSliders";

  return (
    <div className="panel panel-default" style={panelStyle}>
      <button
        type="button"
        className="btn btn-default"
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
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesValueSliders;
