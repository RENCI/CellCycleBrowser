var React = require("react");
var AlignmentSelect = require("../components/AlignmentSelect");
var AlignmentStore = require("../stores/AlignmentStore");
var ViewActionCreators = require("../actions/ViewActionCreators");

function getStateFromStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  };
}

var AlignmentSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    AlignmentStore.addChangeListener(this.onAlignmentChange);
  },
  componentWillUnmount: function() {
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
  },
  onAlignmentChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeAlignment: function (alignment) {
    ViewActionCreators.selectAlignment(alignment);
  },
  render: function () {
    return (
      <AlignmentSelect
        alignment={this.state.alignment}
        onClick={this.handleChangeAlignment} />
    );
  }
});

module.exports = AlignmentSelectContainer;
