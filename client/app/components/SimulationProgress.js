var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  margin: 0
};

function SimulationProgress(props) {
  var phases = props.subphases.map(function (sub) {
    return sub.phase;
  });

  var numSubphases = props.subphases.reduce(function (p, c) {
    return p + c.subphases.length;
  }, 0);

  var s = props.progress.split(",");
  var trajectory = +s[1];
  var subphase = s[0];
  var phase = subphase.split("_")[0];

  var trajectoryProgress = trajectory / props.numTrajectories * 100 + "%";
  var phaseIndex = phases.indexOf(phase);

  var colors = [
    "progress-bar-success",
    "progress-bar-info",
    "progress-bar-warning"
  ];

  var phaseBars = props.subphases.map(function (sub, i) {
    var n = i < phaseIndex ? sub.subphases.length : i > phaseIndex ? 0 :
            sub.subphases.indexOf(subphase) + 1;
    var progress = n / numSubphases * 100 + "%";

    return (
      <div
        key={sub.phase}
        className={"progress-bar"}
        style={{
          width: progress,
          backgroundColor: props.phaseColorScale(sub.phase),
          transition: "none"
        }}>
          {sub.phase}
      </div>
    );
  });

  return (
    // Wrap in outer div so React doesn't complain about unmounting after being closed
    <div>
      <div className="alert alert-info" style={divStyle}>
        <div className="progress">
          <div
            className="progress-bar"
            style={{width: trajectoryProgress}}>
              {"Cell " + trajectory}
          </div>
        </div>
        <div className="progress">
          {phaseBars}
        </div>
      </div>
    </div>
  );
}

SimulationProgress.propTypes = {
  subphases: PropTypes.arrayOf(PropTypes.object).isRequired,
  numTrajectories: PropTypes.number.isRequired,
  progress: PropTypes.string.isRequired,
  phaseColorScale: PropTypes.func.isRequired
};

module.exports = SimulationProgress;
