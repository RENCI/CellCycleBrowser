var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  padding: 4,
  height: 32,
  width: 20
};

function TrackColorIcon(props) {
  var traceSelected = props.track.average.selected ||
                      props.track.traces.reduce(function (p, c) {
                        return p || c.selected;
                      }, false);

  var m = divStyle.padding;
  var h = (divStyle.height - divStyle.padding * 2 - m) / 2;

  var sourceStyle = {
    backgroundColor: props.track.sourceColor,
    width: "100%",
    height: h,
    borderRadius: h / 4,
    marginBottom: m,
    cursor: "default"
  };

  var trackStyle = {
    backgroundColor: props.track.color,
    width: "100%",
    height: h,
    borderRadius: h / 4,
    visibility: (!props.track.phaseTrack && traceSelected) ? "visible" : "hidden",
    cursor: "default"
  };

  return (
    <div style={divStyle}>
      <div
        style={sourceStyle}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Source color">
      </div>
      <div
        style={trackStyle}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Track color">
      </div>
    </div>
  );
}

TrackColorIcon.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = TrackColorIcon;
