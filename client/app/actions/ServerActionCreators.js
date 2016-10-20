var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  receiveProfileList: function(profileList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_PROFILE_LIST,
      profileList: profileList
    });
  },
  receiveProfile: function(profile) {
    console.log(profile);

    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_PROFILE,
      profile: profile
    });
  }
};
