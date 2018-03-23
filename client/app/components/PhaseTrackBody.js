var React = require("react");
var PropTypes = require("prop-types");
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TraceControlsContainer = require("../containers/TraceControlsContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");

var border = "1px solid #ccc";

var averageRowStyle = {
  marginLeft: 0,
  marginRight: -1,
  border: border,
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  padding: 0
};

var traceButtonColumnStyle = {
  padding: 0,
  marginTop: -1
};

var averageColumnStyle = {
  padding: 0,
  borderLeft: border
};

var collapseRowStyle = {
  // Make up for border in rowStyle
  marginLeft: 1,
  marginRight: 0
};

var collapseColumnStyle = {
  padding: 0,
  borderLeft: border
};

function PhaseTrackBody(props) {
  // Id for collapse button/content
  var collapseId = props.track.id + "_Collapse";

  var collapseClasses = "row collapse" + (props.track.collapse ? "" : " in");

  var averageHeight = 32;
  var traceHeight = 20;

  var col1 = props.shiftRight ? "col-xs-3" : "col-xs-2";
  var col2 = props.shiftRight ? "col-xs-9" : "col-xs-10";

  return (
    <div>
      <div className="row" style={averageRowStyle}>
        <div className={col1} style={buttonColumnStyle}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <CollapseButtonContainer
              targetId={collapseId}
              track={props.track} />
            <div style={{flex: 1}}>
              <TraceControlsContainer
                traces={[props.track.average]}
                width={traceHeight}
                height={averageHeight} />
            </div>
          </div>
        </div>
        <div className={col2} style={averageColumnStyle}>
          <PhaseMapContainer
            data={[props.track.average.phases]}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory === "average" ? "0" : "-1"}
            colorScale={props.colorScale}
            height={averageHeight}
            isAverage={true}
            alignment={props.alignment} />
        </div>
      </div>
      <div className={collapseClasses} id={collapseId} style={collapseRowStyle}>
        <div className={col1} style={traceButtonColumnStyle}>
          <TraceControlsContainer
            traces={props.track.traces}
            width={traceHeight}
            height={traceHeight} />
        </div>
        <div className={col2} style={collapseColumnStyle}>
          <PhaseMapContainer
            data={props.track.traces.map(function (d) { return d.phases; })}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory && props.activeTrajectory !== "average" ?
                         props.activeTrajectory : "-1"}
            colorScale={props.colorScale}
            height={props.track.traces.length * traceHeight}
            alignment={props.alignment}  />
        </div>
      </div>
    </div>
  );
}

PhaseTrackBody.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.string,
  colorScale: PropTypes.func.isRequired,
  alignment: PropTypes.string.isRequired,
  shiftRight: PropTypes.bool.isRequired
};

module.exports = PhaseTrackBody;
