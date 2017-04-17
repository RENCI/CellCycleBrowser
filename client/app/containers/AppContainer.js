// Controller-view for the application that stores the current data set

var React = require("react");
var HeaderSection = require("../components/HeaderSection");
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
      profile: {}
    };
  },
  componentDidMount: function () {
    ProfileStore.addChangeListener(this.onProfileChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getProfileList();
    WebAPIUtils.getProfile(0);
  },
  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this.onProfileChange);
  },
  onProfileChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    return (
      <div>
        <HeaderSection />
        <MainSection profile={this.state.profile}/>
      </div>
    );
  }
});

module.exports = AppContainer;
