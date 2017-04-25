var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var HeatLineContainer = require("../containers/HeatLineContainer");
var HeatMapContainer = require("../containers/HeatMapContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5,
  marginBottom: 10
};

var speciesLabelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var dataLabelStyle = {
  float: "none",
  display: "inline-block",
  marginLeft: 20
};

var rowStyle = {
  marginLeft: -2,
  marginRight: -2,
  border: "2px solid #ddd",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0
};

var visColumnStyle = {
  paddingLeft: 5,
  paddingRight:0
};

function Species(props) {
  var simulationCollapseId = props.species.name + "SimulationCollapse";
  var cellDataCollapseId = props.species.name + "CellDataCollapse";

  var averageHeight = 32;
  var trackHeight = 20;

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={speciesLabelStyle}>
            {props.species.name}
          </div>
        </div>
      </div>
      {props.species.simulationOutput.length > 0 ?
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-2 text-left" style={buttonColumnStyle}>
              <CollapseButtonContainer targetId={simulationCollapseId} />
              <div style={dataLabelStyle}>
                Sim
              </div>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatMapContainer
                data={[props.species.simulationOutputAverage]}
                dataExtent={props.species.simulationOutputExtent}
                phases={[props.phaseAverage]}
                timeExtent={props.timeExtent}
                activePhase={props.activePhase}
                phaseColorScale={props.phaseColorScale}
                phaseOverlayOpacity={props.phaseOverlayOpacity}
                height={averageHeight} />
            </div>
          </div>
          <div className="row in" id={simulationCollapseId}>
            <div className="col-sm-10 col-sm-offset-2">
              <HeatMapContainer
                data={props.species.simulationOutput}
                dataExtent={props.species.simulationOutputExtent}
                phases={props.phases}
                timeExtent={props.timeExtent}
                activePhase={props.activePhase}
                phaseColorScale={props.phaseColorScale}
                phaseOverlayOpacity={props.phaseOverlayOpacity}
                height={props.species.simulationOutput.length * trackHeight} />
            </div>
          </div>
        </div>
      : null}
      {props.species.cellData.length > 0 ?
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-2 text-left" style={buttonColumnStyle}>
              <CollapseButtonContainer targetId={cellDataCollapseId} />
              <div style={dataLabelStyle}>
                Cell
              </div>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatMapContainer
                data={[props.species.cellDataAverage]}
                dataExtent={props.species.cellDataExtent}
                phases={[props.activePhases]}
                timeExtent={props.timeExtent}
                activePhase={props.activePhase}
                phaseColorScale={props.phaseColorScale}
                phaseOverlayOpacity={props.phaseOverlayOpacity}
                height={averageHeight} />
            </div>
          </div>
          <div className="row in" id={cellDataCollapseId}>
            <div className="col-sm-10 col-sm-offset-2">
              <HeatMapContainer
                data={props.species.cellData.map(function (d) { return d.values; })}
                dataExtent={props.species.cellDataExtent}
                phases={props.species.cellData.map(function () { return props.activePhases; })}
                timeExtent={props.timeExtent}
                activePhase={props.activePhase}
                phaseColorScale={props.phaseColorScale}
                phaseOverlayOpacity={props.phaseOverlayOpacity}
                height={props.species.cellData.length * trackHeight} />
            </div>
          </div>
        </div>
      : null}
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
  phaseOverlayOpacity: PropTypes.number.isRequired
};

module.exports = Species;
