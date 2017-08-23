var React = require("react");
var PropTypes = React.PropTypes;
var ViewActionCreators = require("../actions/ViewActionCreators");

var nameStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var featureStyle = {
  fontStyle: "italic",
  fontWeight: "normal"
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

function PhaseTrackHeader(props) {
  var featureSpan = props.track.feature ?
      <span style={featureStyle}>{" - " + props.track.feature}</span> : null;

  return (
    <div className="row">
      <div className="col-xs-12" style={{display: "flex"}}>
        <div style={nameStyle}>
          {props.track.species}
          {featureSpan}
        </div>
        <div className="text-center" style={checkboxStyle}>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={props.showPhaseOverlay}
              onChange={handleShowPhaseOverlayChange} />
            Show overlay
          </label>
        </div>
        <div className="text-right" style={sourceStyle}>
          {props.track.source}
        </div>
      </div>
    </div>
  );
}

PhaseTrackHeader.propTypes = {
  track: PropTypes.object.isRequired,
  showPhaseOverlay: PropTypes.bool.isRequired
};

module.exports = PhaseTrackHeader;
