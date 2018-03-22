var React = require("react");
var PropTypes = require("prop-types");
var Slider = require("../components/Slider");

class SliderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue
    };

    // Need to bind this to callback functions here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      value: value
    });

    this.props.onChange(value);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.initialValue
    });
  }

  render() {
    return (
      <Slider
        label={this.props.label}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.value}
        onChange={this.handleChange} />
    );
  }
}

SliderContainer.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  initialValue: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

SliderContainer.defaultProps = {
  label: "",
  min: 0,
  max: 1,
  step: 0.1,
  initialValue: 0.5
};

module.exports = SliderContainer;
