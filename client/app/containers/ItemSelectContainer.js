var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");

function defaultOption(options) {
  return options.length > 0 ? options[0] : { name: "", value: "" };
}

var ItemSelectContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      label: ""
    };
  },
  getInitialState: function () {
    return {
      activeOption: defaultOption(this.props.options)
    };
  },
  handleChange: function (option) {
    this.setState({
      activeOption: option
    });

    this.props.onChange(option.value);
  },
  componentWillReceiveProps: function (nextProps) {
    // Check for valid active option
    for (var i = 0; i < nextProps.options.length; i++) {
      var option = nextProps.options[i];

      if (this.state.activeOption.name === option.name &&
          this.state.activeOption.description === option.description) {
        return;
      }
    }

    // Invalid, so set default
    this.setState({
      activeOption: defaultOption(nextProps.options)
    });
  },
  render: function () {
    return (
        <ItemSelect
          label={this.props.label}
          options={this.props.options}
          activeOption={this.state.activeOption}
          onChange={this.handleChange} />
    );
  }
});

module.exports = ItemSelectContainer;
