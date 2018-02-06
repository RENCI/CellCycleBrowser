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

  return (
    // Wrap in outer div so React doesn't complain about unmounting after being closed
    <div>
      <div className="alert alert-info" style={divStyle}>
        {props.progress}
      </div>
    </div>
  );
}

SimulationProgress.propTypes = {
  subphases: PropTypes.arrayOf(PropTypes.object).isRequired,
  progress: PropTypes.string.isRequired
};

module.exports = SimulationProgress;
