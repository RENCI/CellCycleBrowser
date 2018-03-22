var React = require("react");
var PropTypes = require("prop-types");
var MapArea = require("../components/MapArea");
var BrowserContainer = require("../containers/BrowserContainer");
var ControlsContainer = require("../containers/ControlsContainer");
var AnalysisPlotsContainer = require("../containers/AnalysisPlotsContainer");

var divClass = "container-fluid well";

function MainSection(props) {
  // Render conditionally based on presence of model and cell data
  if (props.hasModel && props.hasTracks) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-sm-3 text-center">
            <MapArea/>
            <ControlsContainer />
          </div>
          <div className="col-sm-6 text-center">
            <BrowserContainer />
          </div>
          <div className="col-sm-3 text-center">
            <AnalysisPlotsContainer />
          </div>
        </div>
      </div>
    );
  }
  else if (props.hasModel) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-sm-4 col-sm-offset-2 text-center">
            <MapArea/>
            <ControlsContainer />
          </div>
          <div className="col-sm-4 text-center">
            <AnalysisPlotsContainer />
          </div>
        </div>
      </div>
    );
  }
  else if (props.hasTracks) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-1 text-center">
            <BrowserContainer />
          </div>
          <div className="col-sm-4 text-center">
            <AnalysisPlotsContainer />
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
  workspace: PropTypes.object.isRequired,
  hasModel: PropTypes.bool.isRequired,
  hasTracks: PropTypes.bool.isRequired
};

module.exports = MainSection;
