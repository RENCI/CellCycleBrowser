var React = require("react");
var PropTypes = React.PropTypes;
var MapContainer = require("../containers/MapContainer");
var BrowserContainer = require("../containers/BrowserContainer");
var ControlsArea = require("./ControlsArea");

var className = "container-fluid well well-sm";

function MainSection(props) {
  // Check for maps and cell data
  var hasMaps = props.data.maps &&
                props.data.maps.length > 0;
  var hasCellData = props.data.cellData &&
                    props.data.cellData.length > 0;

  // Render conditionally
  if (hasMaps && hasCellData) {
    return (
      <div className={className}>
        <div className="row">
          <div className="col-md-3 text-center">
            <MapContainer />
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer />
          </div>
          <div className="col-md-3 text-center">
            <ControlsArea />
          </div>
        </div>
      </div>
    );
  }
  else if (hasMaps) {
    return (
      <div className={className}>
        <div className="row">
          <div className="col-md-3 col-md-offset-3 text-center">
            <MapContainer />
          </div>
          <div className="col-md-3 text-center">
            <ControlsArea />
          </div>
        </div>
      </div>
    );
  }
  else if (hasCellData) {
    return (
      <div className={className}>
        <div className="row">
          <div className="col-md-6 col-md-offset-3 text-center">
            <BrowserContainer />
          </div>
        </div>
      </div>
    );
  }
  else {
    return <div className={className} />
  }
}

MainSection.propTypes = {
  data: PropTypes.object.isRequired
};

module.exports = MainSection;
