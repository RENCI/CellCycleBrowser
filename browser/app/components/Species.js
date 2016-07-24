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
  float: "left",
  width: 35
}

var Species = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    cells: PropTypes.arrayOf(PropTypes.object).isRequired,
    featureKey: PropTypes.string.isRequired
  },
  getInitialState: function () {
    return {
      buttonText: "-"
    }
  },
  onClick: function () {
    this.setState({
      buttonText: this.state.buttonText === "-" ? "+" : "-"
    });
  },
  render: function () {
    // Generate paragraphs with textual representations of cells
    var cells = this.props.cells.map(function (cell, i) {
      var values = cell.features[this.props.featureKey].values;

      return (
        <div key={i}>
          <p>{cell.name}:</p>
          <p>{values.join(", ")}</p>
        </div>
      );
    }.bind(this));

    var id = this.props.name;

    return (
      <div style={outerDivStyle}>
        <div style={speciesStyle}>
          <button
            type="button"
            className="btn btn-info"
            data-toggle="collapse"
            data-target={"#" + id}
            style={buttonStyle}
            onClick={this.onClick}>
              {this.state.buttonText}
          </button>
          <span className="lead">
              Species: {this.props.name}
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
});

module.exports = Species;
