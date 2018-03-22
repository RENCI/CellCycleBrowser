var React = require("react");
var PropTypes = require("prop-types");
var TrackColorIcon = require("./TrackColorIcon");
var Constants = require("../constants/Constants");

var dragStyle = {
  cursor: "ns-resize"
};

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

var sourceStyle = {
  flex: 1,
  marginTop: 5,
  marginRight: 5
};

function PhaseTrackHeader(props) {
  var featureSpan = props.track.feature ?
      <span style={featureStyle}>{" - " + props.track.feature}</span> : null;

  function onDragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(Constants.drag_track_type, props.track.index);
  }

  return (
    <div
      className="row"
      style={dragStyle}
      draggable="true"
      onDragStart={onDragStart}>
        <div className="col-xs-12" style={{display: "flex"}}>
          <div style={nameStyle}>
            {props.track.species}
            {featureSpan}
          </div>
          <div className="text-right" style={sourceStyle}>
            {props.track.source}
          </div>
          <TrackColorIcon track={props.track} />
        </div>
    </div>
  );
}

PhaseTrackHeader.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = PhaseTrackHeader;
