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
  // Generate paragraphs with textual representations of cells
  var cells = props.cells.map(function (cell, i) {
    // Randomize values
    var values = cell.values.slice().sort(function () {
      return 0.5 - Math.random();
    });

    return <p key={i}>Cell {cell.name}: {values.toString()}</p>
  });

  return (
    <div style={divStyle}>
      <h3>Feature {props.name}</h3>
      {cells}
    </div>
  );
}

Feature.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.array.isRequired
};

module.exports = Feature;
