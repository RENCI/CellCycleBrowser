var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  margin: 0
};

var iconStyle = {
  marginRight: 5
};

function SimulationProgress(props) {
  console.log(props.subphases);
  console.log(props.progress);

  var phases = props.subphases.map(function (sub) {
    return sub.phase;
  });

  var numSubphases = props.subphases.reduce(function (p, c) {
    return p + c.subphases.length;
  }, 0);

  var s = props.progress.split(",");
  var trajectory = +s[1] - 1;
  s = s[0].split("_");
  var phase = s[0];
  var subphase = +s[1];

  var trajectoryProgress = trajectory / props.numTrajectories * 100 + "%";
  var phaseIndex = phases.indexOf(phase);

  var colors = [
    "progress-bar-success",
    "progress-bar-info",
    "progress-bar-warning"
  ];

  var phaseBars = props.subphases.map(function (sub, i) {
    var n = i < phaseIndex ? sub.subphases.length : i > phaseIndex ? 0 : subphase;
    var progress = n / numSubphases * 100 + "%";

    console.log(n, numSubphases);

    return (
      <div
        key={sub.phase}
        className={"progress-bar " + colors[i]}
        style={{width: progress}}>
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
            className="progress-bar progress-bar-striped active"
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
  progress: PropTypes.string.isRequired
};

module.exports = SimulationProgress;
