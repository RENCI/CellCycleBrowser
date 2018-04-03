var React = require("react");
var PropTypes = require("prop-types");

var style = {
  position: "fixed",
  top: "30%",
  height: "10%",
  left: "50%",
  width: "50%",
  marginLeft: "-25%",
  opacity: 0.95,
  zIndex: 9999
};

function Alert(props) {
  return (
    props.text === null ? null :
      <div className="panel panel-primary text-center" style={style}>
        <div className="panel-body">
          <h2>{props.text}</h2>
        </div>
      </div>
  );
}

Alert.propTypes = {
  text: PropTypes.string
};

module.exports = Alert;
