var React = require("react");
var PropTypes = React.PropTypes;
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

function Track(props) {
  return (
    <div className="text-left" style={outerStyle}>
      <TrackHeader track={props.track} />
      <TrackBody {...props} />
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activePhases: PropTypes.arrayOf(PropTypes.object).isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired
};

module.exports = Track;
