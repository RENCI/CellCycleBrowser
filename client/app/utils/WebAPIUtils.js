var ServerActionCreators = require("../actions/ServerActionCreators");
var d3 = require("d3");

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

function setupAjax() {
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
      }
    }
  });
}

function createCellData(d) {
  var cd = {};
  cd.name = d.name;
  cd.description = d.description;

  var data = d3.csvParse(d.csv);

  // Nest by species, cell, and feature
  var nest = d3.nest()
      .key(function(d) { return d.Species; })
      .key(function(d) { return d.Cell; })
      .key(function(d) { return d.Feature; })
      .entries(data);

  // Get keys for time samples
  var timeKeys = data.columns.filter(function(d) {
    return d !== "Species" && d !== "Cell" && d !== "Feature";
  });

  // Reformat data
  var species = nest.map(function(d) {
    return {
      name: d.key,
      cells: d.values.map(function(d) {
        return {
          name: d.key,
          features: d.values.map(function(d) {
            return {
              name: d.key,
              values: timeKeys.map(function(key) {
                return +d.values[0][key];
              }).filter(function(d) {
                return !isNaN(d);
              })
            }
          })
        }
      })
    };
  });

  cd.species = species;

  return cd;
}

module.exports = {
  getProfileList: function () {
    setupAjax();

    $.ajax({
      type: "POST",
      url: "/get_profile_list/",
      success: function (data) {
        ServerActionCreators.receiveProfileList(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  },
  getProfile: function (profileIndex) {
    setupAjax();

    $.ajax({
      type: "POST",
      url: "/get_profile/",
      data: { index: profileIndex },
      success: function (data) {
        if (data.cellData) data.cellData = data.cellData.map(createCellData);
        ServerActionCreators.receiveProfile(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  },
  sendParameter: function(data) {
    setupAjax();

    $.ajax({
      type: "POST",
      url: "/send_parameter/",
      data: data,
      success: function (data) {
        console.log(data.response)
        //ServerActionCreators.receiveProfile(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  }
}
