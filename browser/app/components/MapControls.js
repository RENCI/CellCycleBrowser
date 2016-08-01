var React = require("react");
var PropTypes = React.PropTypes;
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
      <ModelSelectContainer
        modelList={props.modelList} />
    </div>
  );
}

MapControls.propTypes = {
  modelList: PropTypes.arrayOf(React.PropTypes.object).isRequired
};

module.exports = MapControls;
