var React = require("react");
var ProfileStore = require("../stores/ProfileStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    profileList: ProfileStore.getProfileList(),
    profileValue: ProfileStore.getProfileIndex().toString()
  };
}

// Use index for value to ensure unique values
function profileOption(profile, i) {
  return {
    value: i.toString(),
    name: profile.name,
    description: profile.description
  };
}

var ProfileSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
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
  handleChangeProfile: function (value) {
    ViewActionCreators.selectProfile(+value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Profile: "
        options={this.state.profileList.map(profileOption)}
        activeValue={this.state.profileValue}
        onChange={this.handleChangeProfile} />
    );
  }
});

module.exports = ProfileSelectContainer;
