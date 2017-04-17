var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// List of available profiles
var profileList = [];

// Active profile
var profile = {};
var profileIndex = -1;

var ProfileStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getProfileList: function () {
    return profileList;
  },
  getProfile: function () {
    return profile;
  },
  getProfileIndex: function () {
    return profileIndex;
  }
});

ProfileStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE_LIST:
      profileList = action.profileList;
      profile = {};
      profileIndex = -1;
      ProfileStore.emitChange();
      break;

    case Constants.RECEIVE_PROFILE:
      profile = action.profile;
      profileIndex = profileList.map(function (profile) {
        // Assuming unique profile names
        return profile.name;
      }).indexOf(profile.name);
      ProfileStore.emitChange();
      break;
  }
});

module.exports = ProfileStore;
