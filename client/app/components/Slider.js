var React = require("react");
var PropTypes = React.PropTypes;

var style = {
  //verticalAlign: "middle"
  marginTop: "-5px",
  marginBottom: "5px"
};

function Slider(props) {
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
          className="control-label col-sm-2"
          htmlFor={sliderName}>
            {props.label}
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <span className="input-group-addon">
              {props.min}
            </span>
            <input
              type="range"
              className="form-control"
              name={sliderName}
              min={0}
              max={valueToSlider(props.max)}
              value={valueToSlider(props.value)}
              onChange={handleSliderChange} />
            <span className="input-group-addon">
              {props.max}
            </span>
            <input
              type="number"
              className="form-control"
              min={props.min}
              max={props.max}
              step={props.step}
              value={props.value}
              onChange={handleNumberChange} />
          </div>
        </div>
      </div>
    </form>
  );
/*
  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label
          htmlFor={sliderName}
          className="control-label text-left col-sm-2">
            {props.label}
        </label>
        <div className="col-sm-1 text-right">
          <p className="form-control-static">
            {props.min}
          </p>
        </div>
        <div className="col-sm-3">
          <input
            name={sliderName}
            type="range"
            className="form-control"
            min={0}
            max={valueToSlider(props.max)}
            value={valueToSlider(props.value)}
            onChange={handleSliderChange} />
        </div>
        <div className="col-sm-1 text-left">
          <p className="form-control-static">
            {props.max}
          </p>
        </div>
        <div className="col-sm-4 text-left">
          <input
            type="number"
            className="form-control"
            min={props.min}
            max={props.max}
            step={props.step}
            value={props.value}
            onChange={handleNumberChange} />
        </div>
      </div>
    </form>
  );
*/
}

Slider.propTypes = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = Slider;
