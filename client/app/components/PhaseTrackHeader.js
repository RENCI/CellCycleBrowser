var React = require("react");
var PropTypes = React.PropTypes;
var ViewActionCreators = require("../actions/ViewActionCreators");

var nameStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var checkboxStyle = {
  flex: 1,
  marginTop: 4
};

var sourceStyle = {
  marginTop: 5,
  marginRight: 30
};

function handleShowPhaseOverlayChange(e) {
  ViewActionCreators.changeShowPhaseOverlay(e.currentTarget.checked);
}

function PhaseTrackHeader() {
  return (
    <div className="row">
      <div className="col-xs-12" style={{display: "flex"}}>
        <div style={nameStyle}>
          Phases
        </div>
        <div className="text-center" style={checkboxStyle}>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              onChange={handleShowPhaseOverlayChange} />
            Show overlay
          </label>
        </div>
        <div className="text-right" style={sourceStyle}>
          Simulation
        </div>
      </div>
    </div>
  );
}

module.exports = PhaseTrackHeader;
