var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButton = require("../components/CollapseButton");
var AlignmentStore = require("../stores/AlignmentStore");

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
  componentDidUpdate: function () {
    // Use jquery to hid/show collapsed area
    $("#" + this.props.targetId).collapse(this.props.track.collapse ? "hide" : "show");
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
        collapse={this.props.track.collapse}
        onClick={this.handleClick} />
    );
  }
});

module.exports = CollapseButtonContainer;
