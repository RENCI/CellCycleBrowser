var React = require("react");
var PropTypes = React.PropTypes;

function ExpressionLevelSlider(props) {
  function round(value) {
    var factor = 1 / props.step;
    return Math.round(value * factor) / factor;
  }

  function sliderToValue(sliderValue) {
    return round(props.min + sliderValue * props.step);
  }

  function valueToSlider(value) {
    return (value - props.min) / props.step;
  }

  function handleSliderChange(e) {
    props.onChange(sliderToValue(+e.currentTarget.value));
  }

  function handleNumberChange(e) {
    props.onChange(round(e.currentTarget.valueAsNumber));
  }

  var sliderName = props.label + "Slider";

  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label
          className="control-label col-xs-2"
          htmlFor={sliderName}>
            {props.label}
        </label>
        <div className="col-xs-10">
          <input
            type="range"
            className="form-control"
            name={sliderName}
            min={0}
            max={valueToSlider(props.max)}
            value={valueToSlider(props.value)}
            onChange={handleSliderChange} />
        </div>
      </div>
    </form>
  );
}

ExpressionLevelSlider.propTypes = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ExpressionLevelSlider;
