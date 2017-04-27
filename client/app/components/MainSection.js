var React = require("react");
var PropTypes = React.PropTypes;
var MapArea = require("../components/MapArea");
var BrowserContainer = require("../containers/BrowserContainer");
var ControlsContainer = require("../containers/ControlsContainer");
var SummaryPlotsArea = require("../components/SummaryPlotsArea");

var divClass = "container-fluid well";

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
            <ControlsContainer />
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer />
          </div>
          <div className="col-md-3 text-center">
            <SummaryPlotsArea />
          </div>
        </div>
      </div>
    );
  }
  else if (hasModels) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-md-4 col-md-offset-2 text-center">
            <MapArea/>
            <ControlsContainer />
          </div>
          <div className="col-md-4 text-center">
            <SummaryPlotsArea />
          </div>
        </div>
      </div>
    );
  }
  else if (hasCellData) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-md-6 col-md-offset-1 text-center">
            <BrowserContainer />
          </div>
          <div className="col-md-4 text-center">
            <SummaryPlotsArea />
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
