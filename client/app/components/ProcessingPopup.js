var React = require("react");

var style = {
  position: "fixed",
  top: "30%",
  height: "10%",
  left: "50%",
  width: "50%",
  marginLeft: "-25%",
  opacity: 0.95,
  zIndex: 100
};

var defaultLabel = "Processing";

function ProcessingPopup() {
  return (
    <div className="panel panel-primary text-center" style={style}>
      <div className="panel-body">
        <h2>Processing</h2>
      </div>
    </div>
  );
}

module.exports = ProcessingPopup;
