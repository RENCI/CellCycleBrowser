var React = require("react");
var AlignmentSelect = require("../components/AlignmentSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var AlignmentSelectContainer = React.createClass ({
  handleChangeAlignment: function (e) {
    ViewActionCreators.selectAlignment(e.target.value);
  },
  render: function () {
    return <AlignmentSelect onClick={this.handleChangeAlignment} />;
  }
});

module.exports = AlignmentSelectContainer;