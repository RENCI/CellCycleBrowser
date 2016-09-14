var ServerActionCreators = require("../actions/ServerActionCreators");

// Get a cookie for cross site request forgery (CSRF) protection
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // These HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

module.exports = {
  getProfileList: function () {
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
      }
    });

    $.ajax({
      type: "POST",
      url: '/get_profile_list/',
      success: function (data) {
        ServerActionCreators.receiveProfileList(data.profilelist);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  },
  getProfile: function (profileKey) {
    setTimeout(function() {
      var profile = JSON.parse(localStorage.getItem("profiles"))[profileKey];

      ServerActionCreators.receiveProfile(profile);
    }, 0);
  }
}
