var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var HeatLineContainer = require("../containers/HeatLineContainer");
var HeatMapContainer = require("../containers/HeatMapContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5
};

var dragStyle = {
  cursor: "ns-resize"
}

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10
};

var nameStyle = {
  fontWeight: "bold"
};

var featureStyle = {
  fontStyle: "italic"
};

var sourceStyle = {
  marginRight: 10,
  float: "right"
};

var rowStyle = {
  marginLeft: -1,
  marginRight: -1,
  border: "1px solid #ccc",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5,
  marginBottom: -1
};

var buttonColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0
};

var visColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

var collapseRowStyle = {
  marginTop: 1,
  marginLeft: -1,
  marginRight: -1,
  borderLeft: "1px solid #ccc",
  borderRight: "1px solid #ccc"
};

var collapseColStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

function Species(props) {
  // Generate unique id for species
  // XXX: Could pass in array index for this?
  var collapseId = props.species.species + "_" +
                   props.species.feature + "_" +
                   props.species.source + "_Collapse";
  collapseId = collapseId.replace(/\s/g, "");

  var averageHeight = 32;
  var trackHeight = 20;

  var featureSpan = props.species.feature ?
      <span style={featureStyle}>{" - " + props.species.feature}</span> : null;

  return (
    <div className="text-left" style={outerStyle}>
      <div
        className="row"
        style={dragStyle}
        draggable="true"
        data-index={props.species.index}
        onDragStart={props.onDragStart}>
          <div className="col-xs-12">
            <div style={labelStyle}>
              <span style={nameStyle}>{props.species.species}</span>
              {featureSpan}
              <span style={sourceStyle}>{props.species.source}</span>
            </div>
          </div>
      </div>
      <div>
        <div className="row" style={rowStyle}>
          <div className="col-xs-2 text-left" style={buttonColumnStyle}>
            <CollapseButtonContainer targetId={collapseId} />
          </div>
          <div className="col-xs-10" style={visColumnStyle}>
            <HeatMapContainer
              data={[props.species.average]}
              dataExtent={props.species.dataExtent}
              phases={[props.activePhases]}
              timeExtent={props.timeExtent}
              activePhase={props.activePhase}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={averageHeight} />
          </div>
        </div>
        <div className="row in" id={collapseId} style={collapseRowStyle}>
          <div className="col-xs-10 col-xs-offset-2" style={collapseColStyle}>
            <HeatMapContainer
              data={props.species.data.map(function (d) { return d.values; })}
              dataExtent={props.species.dataExtent}
              phases={props.species.data.map(function () { return props.activePhases; })}
              timeExtent={props.timeExtent}
              activePhase={props.activePhase}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={props.species.data.length * trackHeight} />
          </div>
        </div>
      </div>
    </div>
  );
}

Species.propTypes = {
  species: PropTypes.object.isRequired,
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activePhases: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePhase: PropTypes.string.isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired
};

module.exports = Species;
