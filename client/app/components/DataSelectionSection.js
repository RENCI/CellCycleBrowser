var React = require("react");
var PropTypes = React.PropTypes;
var Profile = require("../components/Profile");
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");
var ModelSelectContainer = require("../containers/ModelSelectContainer");

var style = {
  borderRightColor: "#ccc",
  borderRightStyle: "solid",
  borderRightWidth: 1
};

function DataSelectionSection(props) {
  return (
    <div className="row well">
      <div className="col-md-6 text-center" style={style}>
        <Profile profile={props.profile} />
      </div>
      <div className="col-md-3 text-center" style={style}>
          <CellDataSelectContainer />
          <FeatureSelectContainer />
      </div>
      <div className="col-md-3 text-center">
          <ModelSelectContainer />
      </div>
    </div>
  );
}

DataSelectionSection.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = DataSelectionSection;
