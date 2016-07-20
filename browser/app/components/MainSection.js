var React = require("react");
var PropTypes = React.PropTypes;
var MapArea = require("../components/MapArea");
var BrowserArea = require("../components/BrowserArea");
var ControlsArea = require("../components/ControlsArea");

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
            <MapArea maps={props.data.maps} />
          </div>
          <div className="col-md-6 text-center">
            <BrowserArea cellData={props.data.cellData} />
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
            <MapArea maps={props.data.maps} />
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
            <BrowserArea cellData={props.data.cellData} />
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
