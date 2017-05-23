var React = require("react");
var PropTypes = React.PropTypes;
var SpeciesDivider = require("../components/SpeciesDivider");

var SpeciesDividerContainer = React.createClass ({
  propTypes: {
    index: PropTypes.number.isRequired,
    onMouseUp: PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {
      visible: false
    };
  },
  handleMouseEnter: function () {
    this.setState({
      visible: true
    });
  },
  handleMouseLeave: function () {
    this.setState({
      visible: false
    });
  },
  render: function () {
    return (
      <SpeciesDivider
        index={this.props.index}
        visible={this.state.visible}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseUp={this.props.onMouseUp} />
    );
  }
});

module.exports = SpeciesDividerContainer;
