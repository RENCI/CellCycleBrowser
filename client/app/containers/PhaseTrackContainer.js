var React = require("react");
var PropTypes = require("prop-types");
var PhaseTrackHeader = require("../components/PhaseTrackHeader");
var PhaseTrackBody = require("../components/PhaseTrackBody");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5
};

class PhaseTrackContainer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="text-left" style={outerStyle}>
        <PhaseTrackHeader
          track={this.props.track}
          showPhaseOverlay={this.props.showPhaseOverlay} />
        <PhaseTrackBody {...this.props} />
      </div>
    );
  }
}

PhaseTrackContainer.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.string,
  colorScale: PropTypes.func.isRequired,
  alignment: PropTypes.string.isRequired,
  shiftRight: PropTypes.bool.isRequired
};

module.exports = PhaseTrackContainer;
