var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");

var divStyle = {
  marginTop: 10
};

var labelStyle = {
  width: 50,
  marginRight: 5
}

var valueStyle = {
  width: 30,
  marginLeft: 5
};

function valueLabel(value) {
  var x = value.exponent;
  var v = Math.round(Math.pow(2, Math.abs(x)));

  return x < 0 && v !== 1 ?
         <div dangerouslySetInnerHTML={{__html: fraction(1, v)}}></div> :
         v + "x";

  function fraction(n, d) {
    return n + "/" + d + "x";
//    return n + "&frasl;" + d + "x";
//    return "<sup>" + n + "</sup>&frasl;<sub>" + d + "</sub>x";
  }
}

function DegradationSliders(props) {
  if (props.species.length <= 1) return null;

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
        <div className="text-right" style={labelStyle}>
          <label>{species}</label>
        </div>
        <div style={{flex: 1}}>
          <ValueSliderContainer
            min={value.min}
            max={value.max}
            initialValue={0}
            value={value.exponent}
            onChange={handleChange} />
        </div>
        <div className="text-right" style={valueStyle}>
          <label>{valueLabel(value)}</label>
        </div>
      </div>
    );
  });

  return (
    <Collapsible
      id="DegradationSliders"
      label="Species degradations"
      onCollapse={props.onCollapse}>
        <div style={divStyle}>
          {sliders}
        </div>
    </Collapsible>
  );
}

DegradationSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired
};

module.exports = DegradationSliders;
