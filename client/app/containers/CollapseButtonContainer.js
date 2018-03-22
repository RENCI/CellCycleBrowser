var React = require("react");
var PropTypes = require("prop-types");
var CollapseButton = require("../components/CollapseButton");

class CollapseButtonContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      toggle: false
    };

    // Need to bind this to callback functions here
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Store collapse with track. No need to go through DataStore, as no other
    // component cares about this
    this.props.track.collapse = !this.props.track.collapse;

    // Trigger a re-rendering
    this.setState({
      toggle: !this.state.collapse
    });
  }

  render() {
    return (
      <CollapseButton
        targetId={this.props.targetId}
        collapse={this.props.track.collapse}
        onClick={this.handleClick} />
    );
  }
}

CollapseButtonContainer.propTypes = {
  targetId: PropTypes.string.isRequired,
  track: PropTypes.object.isRequired
};

module.exports = CollapseButtonContainer;
