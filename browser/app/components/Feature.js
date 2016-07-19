var React = require("react");
var PropTypes = React.PropTypes;

// TODO: Move to css file
var outerDivStyle = {
  marginBottom: 20
};

var featureStyle = {
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

function Feature(props) {
  // Generate paragraphs with textual representations of cells
  var cells = props.cells.map(function (cell, i) {
    // Randomize values
    var values = cell.values.slice().sort(function () {
      return 0.5 - Math.random();
    });

    return <p key={i}>Cell {cell.name}: {values.toString()}</p>
  });

  var id = props.name;

  return (
    <div style={outerDivStyle}>
      <div style={featureStyle}>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="collapse"
          data-target={"#" + id}
          style={buttonStyle}>
            +
        </button>
        <span className="lead">
            Feature {props.name}
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

Feature.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.array.isRequired
};

module.exports = Feature;
