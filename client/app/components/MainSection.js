var React = require("react");
var PropTypes = React.PropTypes;
var MapArea = require("../components/MapArea");
var BrowserContainer = require("../containers/BrowserContainer");
var ControlsContainer = require("../containers/ControlsContainer");
var SummaryPlotsArea = require("../components/SummaryPlotsArea");

var divClass = "container-fluid well";

function MainSection(props) {
  // Check for models and cell data
  var hasModels = props.workspace.modelList &&
                  props.workspace.modelList.length > 0;

  var hasDatasets = props.workspace.datasetList &&
                    props.workspace.datasetList.length > 0;

  // Render conditionally based on presence of model and cell data
  if (hasModels && hasDatasets) {
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
            <SummaryPlotsArea
              hasModels={hasModels}
              hasDatasets={hasDatasets} />
          </div>
        </div>
      </div>
    );
  }
  else if (hasModels) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-sm-4 col-sm-offset-2 text-center">
            <MapArea/>
            <ControlsContainer />
          </div>
          <div className="col-sm-4 text-center">
            <SummaryPlotsArea
              hasModels={hasModels}
              hasDatasets={hasDatasets} />
          </div>
        </div>
      </div>
    );
  }
  else if (hasDatasets) {
    return (
      <div className={divClass}>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-1 text-center">
            <BrowserContainer />
          </div>
          <div className="col-sm-4 text-center">
            <SummaryPlotsArea
              hasModels={hasModels}
              hasDatasets={hasDatasets} />
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
  workspace: PropTypes.object.isRequired
};

module.exports = MainSection;
