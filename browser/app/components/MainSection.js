var React = require("react");
var PropTypes = React.PropTypes;
var MapArea = require("../components/MapArea");
var BrowserContainer = require("../containers/BrowserContainer");
var ControlsContainer = require("../containers/ControlsContainer");

var divClass = "container-fluid well well-sm";

function MainSection(props) {
  // Check for models and cell data
  var hasModels = props.profile.models &&
                props.profile.models.length > 0;
  var hasCellData = props.profile.cellData &&
                    props.profile.cellData.length > 0;

  // Render conditionally based on presence of model and cell data
  if (hasModels && hasCellData) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-md-3 text-center">
            <MapArea/>
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer />
          </div>
          <div className="col-md-3 text-center">
            <ControlsContainer />
          </div>
        </div>
      </div>
    );
  }
  else if (hasModels) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-md-3 col-md-offset-3 text-center">
            <MapArea/>
          </div>
          <div className="col-md-3 text-center">
            <ControlsContainer />
          </div>
        </div>
      </div>
    );
  }
  else if (hasCellData) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-md-6 col-md-offset-3 text-center">
            <BrowserContainer />
          </div>
        </div>
      </div>
    );
  }
  else {
    return null;
  }
}

MainSection.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = MainSection;
