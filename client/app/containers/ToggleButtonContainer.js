var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButton = require("../components/ToggleButton");
var SelectAllButton = require("../components/SelectAllButton");
var UnselectAllButton = require("../components/UnselectAllButton");

var ToggleButtonContainer = React.createClass ({
  propTypes: {
    selected: PropTypes.bool,
    onClick: PropTypes.func
  },
  getDefaultProps: function () {
    return {
      selected: false,
      onClick: null
    }
  },
  getInitialState: function () {
    return {
      mouseOver: false,
      mouseDown: false
    };
  },
  handleMouseOver: function () {
    this.setState({
      mouseOver: true
    });
  },
  handleMouseOut: function () {
    this.setState({
      mouseOver: false
    });
  },
  handleMouseDown: function () {
    this.setState({
      mouseDown: true
    });
  },
  handleMouseUp: function () {
    this.setState({
      mouseDown: false
    });
  },
  render: function () {
    return (
      <ToggleButton
        selected={this.props.selected}
        mouseOver={this.state.mouseOver}
        mouseDown={this.state.mouseDown}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.props.onClick} />
    );
  }
});

module.exports = ToggleButtonContainer;
