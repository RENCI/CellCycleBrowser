var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButton = require("../components/CollapseButton");

var CollapseButtonContainer = React.createClass ({
  propTypes: {
    targetId: PropTypes.string.isRequired,
    track: PropTypes.object.isRequired,
  },
  getInitialState: function () {
    return {
      toggle: false
    };
  },
  handleClick: function () {
    // Store collapse with track. No need to go through DataStore, as no other
    // component cares about this
    this.props.track.collapse = !this.props.track.collapse;

    // Trigger a re-rendering
    this.setState({
      toggle: !this.state.collapse
    });
  },
  render: function () {
    return (
      <CollapseButton
        targetId={this.props.targetId}
        collapse={this.props.track.collapse}
        onClick={this.handleClick} />
    );
  }
});

module.exports = CollapseButtonContainer;
