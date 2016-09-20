var React = require("react");
var ModelSelectContainer = require("../containers/ModelSelectContainer");

// TODO: Need to update manually to align with BrowserControls because of its
// inline-block style. Is there a better way to handle this?
// TODO: Problem could be with lead style on label. Check this.
var divStyle = {
  marginTop: 15,
  marginBottom: 20
};

function MapControls(props) {
  return (
    <div style={divStyle}>
      <ModelSelectContainer />
    </div>
  );
}

module.exports = MapControls;
