var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");

var rowStyle = {
  margin: 0,
  border: "1px solid #ccc",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  padding: 0
};

var visColumnStyle = {
  padding: 0,
  borderLeft: "1px solid #ccc"
};

var collapseRowStyle = {
  // Make up for border in rowStyle
  marginLeft: 1,
  marginRight: 0,
  borderRight: "1px solid #ccc"
};

var collapseColumnStyle = {
  padding: 0,
  borderLeft: "1px solid #ccc"
};

function PhaseTrackBody(props) {
  // Generate unique id for track
  var collapseId = props.track.species + "_" +
                   props.track.feature + "_" +
                   props.track.source + "_Collapse";

  // Remove non "word" characters
  collapseId = collapseId.replace(/\W/g, "");

  var averageHeight = 32;
  var trackHeight = 20;

  return (
    <div>
      <div className="row" style={rowStyle}>
        <div className="col-xs-2 text-left" style={buttonColumnStyle}>
          <CollapseButtonContainer targetId={collapseId} />
        </div>
        <div className="col-xs-10" style={visColumnStyle}>
          <PhaseMapContainer
            data={[props.track.average]}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory === "average" ? "0" : "-1"}
            colorScale={props.colorScale}
            height={averageHeight}
            isAverage={true} />
        </div>
      </div>
      <div className="row in" id={collapseId} style={collapseRowStyle}>
        <div className="col-xs-10 col-xs-offset-2" style={collapseColumnStyle}>
          <PhaseMapContainer
            data={props.track.traces}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory && props.activeTrajectory !== "average" ?
                         props.activeTrajectory : "-1"}
            colorScale={props.colorScale}
            height={props.track.traces.length * trackHeight} />
        </div>
      </div>
    </div>
  );
}

PhaseTrackBody.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.string,
  colorScale: PropTypes.func.isRequired
};

module.exports = PhaseTrackBody;
