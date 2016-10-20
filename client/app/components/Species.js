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

var speciesLableStyle = {
  display: "inline-block",
  textAlign: "center",
  marginLeft: 10
};

function Species(props) {
  // Generate feature data
  var featureData = props.cells.map(function (cell, i) {
    return cell.features[props.featureKey].values;
  });

  var collapseId = props.name;

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
}

Species.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureKey: PropTypes.string.isRequired,
  alignment: PropTypes.string.isRequired
},

module.exports = Species;
