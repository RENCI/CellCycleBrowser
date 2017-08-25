var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButton = require("../components/ToggleButton");
var AlignmentStore = require("../stores/AlignmentStore");

var ToggleButtonContainer = React.createClass ({
  propTypes: {
    height: PropTypes.number,
    selected: PropTypes.bool,
    onClick: PropTypes.func
  },
  getDefaultProps: function () {
    return {
      height: 20,
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
        height={this.props.height}
        mouseOver={this.state.mouseOver}
        mouseDown={this.state.mouseDown}
        selected={this.props.selected}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.props.onClick} />
    );
  }
});

module.exports = ToggleButtonContainer;
