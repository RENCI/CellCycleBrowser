var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");

function defaultActiveOption(currentActiveOption, options) {
  if (options.indexOf(currentActiveOption) !== -1) {
    return currentActiveOption;
  }
  else if (options.length > 0) {
    return options[0];
  }
  else {
    return {
      name: "",
      value: ""
    };
  }
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
      activeOption: defaultActiveOption(null, this.props.options)
    };
  },
  handleChange: function (option) {
    this.setState({
      activeOption: option
    });

    this.props.onChange(option.value);
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      activeOption: defaultActiveOption(this.state.activeOption, nextProps.options)
    })
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
