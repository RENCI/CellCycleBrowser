var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");

var divStyle = {
  marginTop: 10
};

function ExpressionLevelSliders(props) {
  var sliders = props.species.map(function (species, i) {
    function handleChange(value) {
      props.onChange({
        species: species,
        value: value
      });
    };

    var value = props.values[species];

    return (
      <div key={i} style={{display: "flex"}}>
        <div className="text-right" style={{width: 50, marginRight: 5}}>
          <label>{species}</label>
        </div>
        <div style={{flex: 1}}>
          <ValueSliderContainer
            min={value.min}
            max={value.max}
            value={value.value}
            onChange={handleChange} />
        </div>
      </div>
    );
  });

  return (
    <Collapsible
      id="ExpressionLevelSliders"
      label="Expression levels">
        <div style={divStyle}>
          {sliders}
        </div>
    </Collapsible>
  );
}

ExpressionLevelSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ExpressionLevelSliders;
