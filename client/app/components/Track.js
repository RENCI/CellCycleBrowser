var React = require("react");
var PropTypes = require("prop-types");
var TrackHeader = require("../components/TrackHeader");
var TrackBody = require("../components/TrackBody");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5
};

class Track extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(props) {
    return !props.processing;
  }

  render() {
    return (
      <div className="text-left" style={outerStyle}>
        <TrackHeader track={this.props.track} />
        <TrackBody {...this.props} />
      </div>
    );
  }
}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired,
  showPhaseOverlay: PropTypes.bool.isRequired,
  shiftRight: PropTypes.bool.isRequired,
  processing: PropTypes.bool.isRequired
};

module.exports = Track;
