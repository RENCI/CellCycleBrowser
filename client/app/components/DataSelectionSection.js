var React = require("react");
var PropTypes = React.PropTypes;
var Profile = require("../components/Profile");
var Model = require("../components/Model");
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");

var containerStyle = {
  paddingTop: 0,
  paddingBottom: 0
};

var hrStyle = {
  borderColor: "#ddd",
  marginTop: 0,
  marginBottom: 0
};

function DataSelectionSection(props) {
  return (
    <div className="container-fluid well" style={containerStyle}>
      <div className="row">
        <div className="col-xs-12">
          <Profile profile={props.profile} />
        </div>
      </div>
      <hr style={hrStyle}/>
      <div className="row">
        <div className="col-xs-3 text-center">
          <Model />
        </div>
        <div className="col-xs-6 text-center">
          <CellDataSelectContainer />
        </div>
      </div>
    </div>
  );
}

DataSelectionSection.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = DataSelectionSection;
