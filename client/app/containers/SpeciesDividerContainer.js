var React = require("react");
var PropTypes = React.PropTypes;
var SpeciesDivider = require("../components/SpeciesDivider");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

function canDrag(e) {
  return e.dataTransfer.types.indexOf(Constants.drag_track_type) !== -1;
}

function shouldInsert(speciesIndex, dividerIndex) {
  return speciesIndex !== dividerIndex &&
         speciesIndex !== dividerIndex - 1;
}

function getSpeciesIndex(e) {
  return +e.dataTransfer.getData(Constants.drag_track_type);
}

var SpeciesDividerContainer = React.createClass ({
  propTypes: {
    index: PropTypes.number.isRequired
  },
  getInitialState: function () {
    return {
      dragValid: false
    };
  },
  handleDragEnter: function (e) {
    if (canDrag(e)) {
      e.dataTransfer.dropEffect = "move";

      this.setState({
        dragValid: true
      });
    }
  },
  handleDragOver: function (e) {
    if (this.state.dragValid) {
      e.preventDefault();
    }
  },
  handleDragLeave: function () {
    if (this.state.dragValid) {
      this.setState({
        dragValid: false
      });
    }
  },
  handleDrop: function (e) {
    if (this.state.dragValid) {
      var speciesIndex = getSpeciesIndex(e);

      if (shouldInsert(speciesIndex, this.props.index)) {
        ViewActionCreators.insertTrack(speciesIndex, this.props.index);
      }

      this.setState({
        dragValid: false
      });
    }
  },
  render: function () {
    return (
      <SpeciesDivider
        index={this.props.index}
        visible={this.state.dragValid}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop} />
    );
  }
});

module.exports = SpeciesDividerContainer;
