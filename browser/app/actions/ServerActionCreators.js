var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  receiveData: function(data) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA,
      data: data
    });
  }
};
