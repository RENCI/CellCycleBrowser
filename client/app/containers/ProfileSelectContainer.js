var React = require("react");
var ProfileListStore = require("../stores/ProfileListStore");
var ItemSelectContainer = require("./ItemSelectContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

function profileOption(profile, i) {
  return {
    value: i.toString(),
    name: profile.name,
    description: profile.description
  }
}

function getStateFromStore() {
  return {
    profileList: ProfileListStore.getProfileList()
  };
}

var ProfileSelectContainer = React.createClass ({
  getInitialState: function () {
    return {
      profileList: []
    };
  },
  componentDidMount: function () {
    ProfileListStore.addChangeListener(this.onProfileListChange);

    // Get initial data
    WebAPIUtils.getProfileList();
    WebAPIUtils.getProfile(0);
  },
  componentWillUnmount: function() {
    ProfileListStore.removeChangeListener(this.onProfileListChange);
  },
  onProfileListChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeProfile: function (value) {
    ViewActionCreators.selectProfile(value);
  },
  render: function () {
    return (
      <ItemSelectContainer
        label="Profile: "
        options={this.state.profileList.map(profileOption)}
        onChange={this.handleChangeProfile} />
    );
  }
});

module.exports = ProfileSelectContainer;
