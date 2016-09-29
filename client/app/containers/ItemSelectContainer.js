var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");

function defaultActiveOption() {
  return {
    name: "",
    value: ""
  };
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
      activeOption: defaultActiveOption()
    };
  },
  handleChange: function (option) {
    this.setState({
      activeOption: option
    });

    this.props.onChange(option.value);
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.options.indexOf(this.state.activeOption) === -1) {
      this.setState({
        activeOption: nextProps.options.length > 0 ?
                      nextProps.options[0] :
                      defaultActiveOption()
      });
    }
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
