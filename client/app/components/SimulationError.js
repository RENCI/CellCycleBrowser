var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  margin: 0
};

var iconStyle = {
  marginRight: 5
};

function SimulationError(props) {
  return (
    // Wrap in outer div so React doesn't complain about unmounting after being closed
    <div>
      <div className="alert alert-danger alert-dismissible" style={divStyle}>
        <button type="button" className="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        <span className="glyphicon glyphicon-exclamation-sign" style={iconStyle}></span>
        {props.error}
      </div>
    </div>
  );
}

SimulationError.propTypes = {
  error: PropTypes.string.isRequired
};

module.exports = SimulationError;
