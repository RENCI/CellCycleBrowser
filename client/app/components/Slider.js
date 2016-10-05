var React = require("react");
var PropTypes = React.PropTypes;

function Slider(props) {
  function handleChange(e) {
    props.onChange(+e.currentTarget.value);
  }

  var sliderName = props.label + "Slider";

  return (
    <div className="row">
      <label
        htmlFor={sliderName}
        className="col-sm-2 control-label">
          {props.label}
      </label>
      <div className="col-sm-10">
        <input
          name={sliderName}
          type="range"
          min={props.min}
          max={props.max}
          value={props.value}
          onChange={handleChange} />
      </div>
    </div>
  );
}

Slider.propTypes = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = Slider;
