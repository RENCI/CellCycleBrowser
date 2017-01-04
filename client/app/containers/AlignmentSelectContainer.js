var React = require("react");
var AlignmentSelect = require("../components/AlignmentSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var AlignmentSelectContainer = React.createClass ({
  handleChangeAlignment: function (alignment) {
    ViewActionCreators.selectAlignment(alignment);
  },
  render: function () {
    return <AlignmentSelect onClick={this.handleChangeAlignment} />;
  }
});

module.exports = AlignmentSelectContainer;
