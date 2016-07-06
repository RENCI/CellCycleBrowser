var React = require("react");
var Header = require("../components/Header");

// Dummy information
var cellLines = [
  {value: "cellLine1", name: "Cell line 1"},
  {value: "cellLine2", name: "Cell line 2"}
];

var HeaderContainer = React.createClass ({
  getInitialState: function () {
    return {
      cellLine: ""
    };
  },
  handleChangeCellLine: function (e) {
    e.preventDefault();

    this.setState({
      cellLine: e.target.value
    });

    console.log(e.target.value);
  },
  render: function () {
    return (
      <Header
        header="Cell Cycle Browser"
        cellLines={cellLines}
        onChangeCellLine={this.handleChangeCellLine} />
    );
  }
});

module.exports = HeaderContainer;
