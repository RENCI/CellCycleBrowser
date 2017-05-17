var React = require("react");
var TrackSort = require("../components/TrackSort");
var ViewActionCreators = require("../actions/ViewActionCreators");

var TrackSortContainer = React.createClass ({
  handleButtonClick: function (sortMethod) {
    ViewActionCreators.sortTracks(sortMethod);
  },
  render: function () {
    return (
      <TrackSort
        onClick={this.handleButtonClick} />
    );
  }
});

module.exports = TrackSortContainer;
