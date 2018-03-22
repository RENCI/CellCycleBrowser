var React = require("react");
var TrackSort = require("../components/TrackSort");
var ViewActionCreators = require("../actions/ViewActionCreators");

class TrackSortContainer extends React.Component {
  constructor() {
    super();
  }

  handleButtonClick(sortMethod) {
    ViewActionCreators.sortTracks(sortMethod);
  }

  render() {
    return <TrackSort onClick={this.handleButtonClick} />;
  }
});

module.exports = TrackSortContainer;
