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
  // Generate feature data
  var featureData = props.cells.map(function (cell, i) {
    return cell.features[props.featureKey].values;
  });

  var simulationCollapseId = props.name + "SimulationCollapse";
  var cellDataCollapseId = props.name + "CellDataCollapse";

  console.log(props);

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={speciesLabelStyle}>
            {props.name}
          </div>
        </div>
      </div>
      {props.simulationData.length > 0 ?
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-2 text-left" style={buttonColumnStyle}>
              <CollapseButtonContainer targetId={simulationCollapseId}/>
              <div style={dataLabelStyle}>
                Sim
              </div>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatLineContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
          <div className="row in" id={simulationCollapseId}>
            <div className="col-sm-10 col-sm-offset-2">
              <HeatMapContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
        </div>
      : null}
      {featureData.length > 0 ?
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-2 text-left" style={buttonColumnStyle}>
              <CollapseButtonContainer targetId={cellDataCollapseId} />
              <div style={dataLabelStyle}>
                Cell
              </div>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
              <HeatLineContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
          <div className="row in" id={cellDataCollapseId}>
            <div className="col-sm-10 col-sm-offset-2">
              <HeatMapContainer
                data={featureData}
                alignment={props.alignment} />
            </div>
          </div>
        </div>
      : null}
    </div>
  );
/*
  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={speciesLabelStyle}>
            {props.name}
          </div>
        </div>
        <div className="col-sm-10">
          {props.simulationData.length > 0 ?
            <div>
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
            </div>
          : null}
          {featureData.length > 0 ?
            <div>
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
          : null}
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
