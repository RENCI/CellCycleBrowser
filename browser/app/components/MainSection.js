var React = require("react");
var PropTypes = React.PropTypes;
var MapArea = require("../components/MapArea");
var BrowserArea = require("../components/BrowserArea");
var ControlsArea = require("../components/ControlsArea");

function MainSection(props) {
  return (
    <div className="container-fluid well well-sm">
      <div className="row">
        <div className="col-md-3 text-center">
          <MapArea map={props.data.map} />
        </div>
        <div className="col-md-6 text-center">
          <BrowserArea data={props.data.cells} />
          </div>
        <div className="col-md-3 text-center">
          <ControlsArea />
        </div>
      </div>
    </div>
  );
}

MainSection.propTypes = {
  data: PropTypes.object.isRequired
};

module.exports = MainSection;
