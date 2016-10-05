var React = require("react");
var PropTypes = React.PropTypes;

function Slider(props) {
  function handleChange(e) {
    props.onChange(+e.currentTarget.value);
  }

  return (
    <div>
      <span className="lead">
        {props.label}
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={handleChange} />
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
