var React = require("react");
var PropTypes = React.PropTypes;
var TrackColorIcon = require("./TrackColorIcon");
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

var sourceStyle = {
  flex: 1,
  marginTop: 5,
  marginRight: 5
};

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
