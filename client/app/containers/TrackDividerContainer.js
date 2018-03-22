var React = require("react");
var PropTypes = require("prop-types");
var TrackDivider = require("../components/TrackDivider");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

function canDrag(e) {
  return e.dataTransfer.types.indexOf(Constants.drag_track_type) !== -1;
}

function shouldInsert(speciesIndex, dividerIndex) {
  return speciesIndex !== dividerIndex &&
         speciesIndex !== dividerIndex - 1;
}

function getTrackIndex(e) {
  return +e.dataTransfer.getData(Constants.drag_track_type);
}

class TrackDividerContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      dragValid: false
    };

    // Need to bind this to callback functions here
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDragEnter(e) {
    if (canDrag(e)) {
      e.dataTransfer.dropEffect = "move";

      this.setState({
        dragValid: true
      });
    }
  }

  handleDragOver(e) {
    if (this.state.dragValid) {
      e.preventDefault();
    }
  }

  handleDragLeave() {
    if (this.state.dragValid) {
      this.setState({
        dragValid: false
      });
    }
  }

  handleDrop(e) {
    if (this.state.dragValid) {
      var speciesIndex = getTrackIndex(e);

      if (shouldInsert(speciesIndex, this.props.index)) {
        ViewActionCreators.insertTrack(speciesIndex, this.props.index);
      }

      this.setState({
        dragValid: false
      });
    }
  }

  render() {
    return (
      <TrackDivider
        index={this.props.index}
        visible={this.state.dragValid}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop} />
    );
  }
}

TrackDividerContainer.propTypes = {
  index: PropTypes.number.isRequired
};

module.exports = TrackDividerContainer;
