var ServerActionCreators = require("../actions/ServerActionCreators");
var ModelStore = require("../stores/ModelStore");
var SimulationControlStore = require("../stores/SimulationControlStore");
var CellDataStore = require("../stores/CellDataStore");
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

function createCellData(cellData) {
  // Set metadata
  var cd = {};
  cd.name = cellData.name;
  cd.fileName = cellData.fileName;
  cd.description = cellData.description;
  cd.timeUnit = cellData.timeUnit;

  // Parse the csv data
  var data = d3.csvParse(cellData.csv);

  // Get the available features
  cd.features = d3.nest()
      .key(function(d) { return d.Feature; })
      .entries(data).map(function(d) {
        return d.key;
      });

  // Nest by species, cell, and feature
  var nest = d3.nest()
      .key(function(d) { return d.Species; })
      .key(function(d) { return d.Cell; })
      .key(function(d) { return d.Feature; })
      .entries(data);

  // Get keys for time samples
  var timeKeys = data.columns.filter(function(d) {
    return !isNaN(+d);
  });

  // Reformat data
  cd.species = nest.map(function(d) {
    return {
      name: d.key,
      cells: d.values.map(function(d) {
        return {
          name: d.key,
          features: d.values.map(function(d) {
            return {
              name: d.key,
              values: timeKeys.map(function(key) {
                return {
                  value: +d.values[0][key],
                  time: +key / 60
                };
              })
            }
          })
        }
      })
    };
  });

  return cd;
}

function simulationParameters() {
  var model = ModelStore.getModel();
  var controls = SimulationControlStore.getControls();
  var cellData = CellDataStore.getCellData();

  var trajectories = controls.parameters[controls.parameters.map(function (parameter) {
    return parameter.name;
  }).indexOf("numTrajectories")].value;

  var species = controls.species.map(function (species) {
    return {
      species: species,
      value: controls.speciesInitialValues[species].value
    };
  });

  var parameters = [];

  controls.species.forEach(function (species) {
    controls.phases.forEach(function (phase) {
      parameters.push({
        upstream: species,
        downstream: phase,
        value: controls.speciesPhaseMatrix[species][phase].value
      });
    });
  });

  controls.phases.forEach(function (phase) {
    controls.species.forEach(function (upstream, i) {
      controls.species.forEach(function (downstream, j) {
        if (i === j) return;

        parameters.push({
          phase: phase,
          upstream: upstream,
          downstream: downstream,
          value: controls.speciesSpeciesMatrices[phase][upstream][downstream].value
        });
      });
    });
  });

  return {
    trajectories: trajectories,
    species: JSON.stringify(species),
    parameters: JSON.stringify(parameters)
  };
}

function requestSimulationOutput(url) {
  setupAjax();

  $.ajax({
    type: "POST",
    url: url,
    success: function (data) {
      ServerActionCreators.receiveSimulationOutput(data.result);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function pollSimulation(taskId) {
  var timeOutStatusId = -1;

  $.ajax({
    dataType: "json",
    cache: false,
    timeout: 60000,
    type: "POST",
    url: '/check_task_status/',
    data: {
      task_id: taskId
    },
    success: function(data) {
      if (data.result) {
        if (timeOutStatusId > -1) {
          clearTimeout(timeOutStatusId);
        }

        requestSimulationOutput("/get_model_result/" + data.result);
      }
      else {
        timeOutStatusId = setTimeout(function () {
          pollSimulation(taskId);
        }, 1000);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      if (timeOutStatusId > -1) {
        clearTimeout(timeOutStatusId);
      }

      console.log(textStatus + ": " + errorThrown);

      ServerActionCreators.receiveSimulationOutput([]);
    }
  });
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
/*
  sendParameter: function(data) {
    setupAjax();

    $.ajax({
      type: "POST",
      url: "/send_parameter/",
      data: data,
      success: function (data) {
        console.log(data)
        //ServerActionCreators.receiveProfile(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  },
*/
  runSimulation: function () {
    setupAjax();

    $.ajax({
      type: "POST",
      url: "/runmodel/" + ModelStore.getModel().fileName,
      data: simulationParameters(),
      success: function (data) {
        if (data.task_id) {
          pollSimulation(data.task_id);
        }
        else {
          console.log("Empty task_id. Simulation did not start successfully");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus + ": " + errorThrown);
      }
    });
  }
}
