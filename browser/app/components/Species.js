var React = require("react");
var PropTypes = React.PropTypes;

// TODO: Move to css file
var outerDivStyle = {
  marginBottom: 20
};

var speciesStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5,
  display: "block",
  overflow: "auto"
};

var cellStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: 5
}

var buttonStyle = {
  float: "left"
}

function Species(props) {
  // Generate paragraphs with textual representations of cells
  var cells = props.cells.map(function (cell, i) {
    // Randomize values
    var values = cell.features[0].values;

    return (
      <div key={i}>
        <p>{cell.name}:</p>
        <p>{values.join(", ")}</p>
      </div>
    );
  });

  var id = props.name;

  return (
    <div style={outerDivStyle}>
      <div style={speciesStyle}>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="collapse"
          data-target={"#" + id}
          style={buttonStyle}>
            +
        </button>
        <span className="lead">
            Species: {props.name}
        </span>
      </div>
      <div
        className="in"
        id={id}
        style={cellStyle}>
          <p/>
          {cells}
      </div>
    </div>
  );
}

Species.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.array.isRequired
};

module.exports = Species;
