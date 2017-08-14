var React = require("react");
var PropTypes = React.PropTypes;
var PhaseTrackHeader = require("./PhaseTrackHeader");
var PhaseTrackBody = require("./PhaseTrackBody");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5,
  marginTop: 10,
  marginBottom: 10
};

function PhaseTrack(props) {
  if (props.phases.length === 0) {
    return null;
  }

  return (
    <div className="text-left" style={outerStyle}>
      <PhaseTrackHeader />
      <PhaseTrackBody {...props} />
    </div>
  );
}

PhaseTrack.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.object.isRequired,
  colorScale: PropTypes.func.isRequired
};

module.exports = PhaseTrack;
