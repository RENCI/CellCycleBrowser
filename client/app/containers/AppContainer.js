// Controller-view for the application that stores the current dataset

var React = require("react");
var ResizeContainer = require("../containers/ResizeContainer");
var HeaderSection = require("../components/HeaderSection");
var DataSelectionSection = require("../components/DataSelectionSection");
var MainSection = require("../components/MainSection");
var ProfileStore = require("../stores/ProfileStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    profile: ProfileStore.getProfile()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return {
      profile: null
    };
  },
  componentDidMount: function () {
    ProfileStore.addChangeListener(this.onProfileChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getProfileList();
    WebAPIUtils.getDatasetList();
  },
  componentWillUnmount: function () {
    ProfileStore.removeChangeListener(this.onProfileChange);
  },
  onProfileChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    var hasProfile = this.state.profile && this.state.profile.name;

    return (
      <div>
        <ResizeContainer />
        <HeaderSection />
        {hasProfile ?
          <DataSelectionSection profile={this.state.profile} /> : null }
        {hasProfile ?
          <MainSection profile={this.state.profile} /> : null}
      </div>
    );
  }
});

module.exports = AppContainer;
