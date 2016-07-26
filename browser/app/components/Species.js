var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");

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

var visPlaceholder1 = {
  backgroundColor: "linen",
  height: 35,
  width: "100%"
};

var visPlaceholder2 = {
  backgroundColor: "lightcyan",
  height: 250,
  width: "100%"
};

function Species(props) {
/*
  // Generate paragraphs with textual representations of cells
  var cells = props.cells.map(function (cell, i) {
    var values = cell.features[props.featureKey].values;

    return (
      <div key={i}>
        {cell.name}
      </div>
    );
  }.bind(this));
*/
  var collapseId = props.name; 

  return (
    <div className="row text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-3">
          <CollapseButtonContainer targetId={collapseId} />
          <div style={speciesLableStyle}>
            {props.name}
          </div>
        </div>
        <div className="col-sm-9">
          <div style={visPlaceholder1} />
        </div>
      </div>
      <div className="row in" id={collapseId} >
        <div className="col-sm-9 col-sm-offset-3">
          <div style={visPlaceholder2} />
        </div>
      </div>
    </div>
  );
}

Species.propTypes = {
    name: PropTypes.string.isRequired,
    cells: PropTypes.arrayOf(PropTypes.object).isRequired,
    featureKey: PropTypes.string.isRequired
  },

module.exports = Species;
