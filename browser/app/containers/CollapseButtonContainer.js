var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButton = require("../components/CollapseButton");

var CollapseButtonContainer = React.createClass ({
  propTypes: {
    targetId: PropTypes.string.isRequired
  },
  getInitialState: function () {
    return {
      text: "-"
    };
  },
  handleClick: function (e) {    
    this.setState({
      text: this.state.text === "-" ? "+" : "-"
    });
  },
  render: function () {
    return (
      <CollapseButton
        text={this.state.text}
        targetId={this.props.targetId}
        onClick={this.handleClick} />
    );
  }
});

module.exports = CollapseButtonContainer;
