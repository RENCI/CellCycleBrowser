var React = require("react");
var PropTypes = React.PropTypes;

// TODO: Move to css file
var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

function Feature(props) {
  var cells = props.feature.cells.map(function (cell, i) {
    var values = cell.values.slice().sort(function () {
      return 0.5 - Math.random();
    });

    return <p key={i}>Cell {cell.name}: {values.toString()}</p>
  });

  return (
    <div style={divStyle}>
      <h3>Feature {props.feature.name}</h3>
      {cells}
    </div>
  );
}

propTypes = {
  feature: PropTypes.object.isRequired
};

module.exports = Feature;
