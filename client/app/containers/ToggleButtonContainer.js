var React = require("react");
var PropTypes = require("prop-types");
var ToggleButton = require("../components/ToggleButton");
var SelectAllButton = require("../components/SelectAllButton");
var UnselectAllButton = require("../components/UnselectAllButton");

class ToggleButtonContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      mouseOver: false,
      mouseDown: false
    };

    // Need to bind this to callback functions here
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseOver() {
    this.setState({
      mouseOver: true
    });
  }

  handleMouseOut() {
    this.setState({
      mouseOver: false
    });
  }

  handleMouseDown() {
    this.setState({
      mouseDown: true
    });
  }

  handleMouseUp() {
    this.setState({
      mouseDown: false
    });
  }

  render() {
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
}

ToggleButtonContainer.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

ToggleButtonContainer.defaultProps = {
  selected: false,
  onClick: null
};

module.exports = ToggleButtonContainer;
