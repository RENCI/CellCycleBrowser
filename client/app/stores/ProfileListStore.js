var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// List of available profiles
var profileList = [];

var ProfileListStore = assign({}, EventEmitter.prototype, {
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
  getDefaultProfile: function () {
    return profileList[0];
  }
});

ProfileListStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE_LIST:
      profileList = action.profileList;
      ProfileListStore.emitChange();
      break;
  }
});

module.exports = ProfileListStore;
