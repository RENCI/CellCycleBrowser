var React = require("react");
var ProfileListStore = require("../stores/ProfileListStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

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
  handleChangeProfile: function (e) {
    ViewActionCreators.selectProfile(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Profile: "
        options={this.state.profileList}
        onChange={this.handleChangeProfile} />
    );
  }
});

module.exports = ProfileSelectContainer;
