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
  marginLeft: 10
};

var dataLabelStyle = {
  float: "none",
  display: "inline-block",
  marginRight: 10
};

var buttonColumnStyle = {
    paddingRight: 0,
    borderLeft: "2px solid #ddd",
    borderTop: "2px solid #ddd",
    borderBottom: "2px solid #ddd",
    marginTop: -2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
};

var visColumnStyle = {
    paddingLeft: 0
};

function Species(props) {
  // Generate feature data
  var featureData = props.cells.map(function (cell, i) {
    return cell.features[props.featureKey].values;
  });

  var simulationCollapseId = props.name + "SimulationCollapse";
  var cellDataCollapseId = props.name + "CellDataCollapse";

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={speciesLabelStyle}>
            {props.name}
          </div>
        </div>
        <div className="col-sm-10">
          <div className="row">
            <div className="col-sm-2 text-right" style={buttonColumnStyle}>
              <div style={dataLabelStyle}>
                Sim
              </div>
              <CollapseButtonContainer targetId={simulationCollapseId}/>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatLineContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
          <div className="row in" id={simulationCollapseId}>
            <div className="col-sm-10 col-sm-offset-2" style={visColumnStyle}>
              <HeatMapContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 text-right" style={buttonColumnStyle}>
              <div style={dataLabelStyle}>
                Cell
              </div>
              <CollapseButtonContainer targetId={cellDataCollapseId} />
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatLineContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
          <div className="row in" id={cellDataCollapseId}>
            <div className="col-sm-10 col-sm-offset-2" style={visColumnStyle}>
              <HeatMapContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
/*
  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-3">
          <CollapseButtonContainer targetId={collapseId} />
          <div style={speciesLableStyle}>
            {props.name}
          </div>
        </div>
        <div className="col-sm-9">
          {props.simulationData ?
            <HeatLineContainer
              data={props.simulationData}
              alignment={props.alignment} /> : null}
          <HeatLineContainer
            data={featureData}
            alignment={props.alignment} />
        </div>
      </div>
      <div className="row in" id={collapseId}>
        <div className="col-sm-9 col-sm-offset-3">
          <HeatMapContainer
            data={featureData}
            alignment={props.alignment} />
        </div>
      </div>
    </div>
  );
*/
}

Species.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureKey: PropTypes.string.isRequired,
  simulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
  alignment: PropTypes.string.isRequired
};

Species.defaultProps = {
  simulationData: [],
};

module.exports = Species;
