var React = require("react");
var PropTypes = React.PropTypes;
var MapSelectContainer = require("../containers/MapSelectContainer");

// TODO: Need to update manually to align with BrowserControls because of its
// inline-block style. Is there a better way to handle this?
var divStyle = {
  marginTop: 15,
  marginBottom: 20
};

function MapControls(props) {
  return (
    <div style={divStyle}>
      <MapSelectContainer
        mapList={props.mapList} />
    </div>
  );
}

MapControls.propTypes = {
  mapList: PropTypes.arrayOf(React.PropTypes.object).isRequired
};

module.exports = MapControls;
