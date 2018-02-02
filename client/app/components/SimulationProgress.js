var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  margin: 0
};

var iconStyle = {
  marginRight: 5
};

function SimulationProgress(props) {
  return (
    // Wrap in outer div so React doesn't complain about unmounting after being closed
    <div>
      <div className="alert alert-info alert-dismissible" style={divStyle}>
        <button type="button" className="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        {props.progress}
      </div>
    </div>
  );
}

SimulationProgress.propTypes = {
  progress: PropTypes.string.isRequired
};

module.exports = SimulationProgress;