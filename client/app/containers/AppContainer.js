// Controller-view for the application that stores the current data set

var React = require("react");
var HeaderSection = require("../components/HeaderSection");
var MainSection = require("../components/MainSection");
var ProfileStore = require("../stores/ProfileStore");

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
  },
  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this.onProfileChange);
  },
  onProfileChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    if (!this.state.profile) return null;

    return (
      <div>
        <HeaderSection profile={this.state.profile}/>
        <MainSection profile={this.state.profile}/>
      </div>
    );
  }
});

module.exports = AppContainer;