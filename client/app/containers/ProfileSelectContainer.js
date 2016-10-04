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

    // Get initial data set list
    WebAPIUtils.getProfileList();
  },
  componentWillUnmount: function() {
    ProfileListStore.removeChangeListener(this.onProfileListChange);
  },
  onProfileListChange: function () {
    this.setState(getStateFromStore());

    // Load first profile
    // TODO: Currently called from ExampleData
    // TODO: Is this the best place for this? Better to have server send
    // along with data set list?
//    WebAPIUtils.getProfile(ProfileListStore.getDefaultProfile().value);
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
