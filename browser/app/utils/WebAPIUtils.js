var ServerActionCreators = require("../actions/ServerActionCreators");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getProfileList: function () {
    setTimeout(function() {
      var profileList = JSON.parse(localStorage.getItem("profileList"));

      ServerActionCreators.receiveProfileList(profileList);
    }, 0);
  },
  getProfile: function (profileKey) {
    setTimeout(function() {
      var profile = JSON.parse(localStorage.getItem("profiles"))[profileKey];

      ServerActionCreators.receiveProfile(profile);
    }, 0);
  }
}
