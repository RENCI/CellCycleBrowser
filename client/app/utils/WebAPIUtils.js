var ServerActionCreators = require("../actions/ServerActionCreators");
var ModelStore = require("../stores/ModelStore");
var SimulationControlStore = require("../stores/SimulationControlStore");
var DatasetStore = require("../stores/DatasetStore");
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

function getWorkspaceList() {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_profile_list/",
    success: function (data) {
      // XXX: Create an id based on the array index
      data.forEach(function (workspace, i) {
        workspace.id = i.toString;
      });

      // Create an action
      ServerActionCreators.receiveWorkspaceList(data);

      // Request first workspace
      getWorkspace(0);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function getModelList() {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_model_list/",
    success: function (data) {
      // Create an action
      ServerActionCreators.receiveModelList(data);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function getDatasetList() {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_dataset_list/",
    success: function (data) {
      // Create an action
      ServerActionCreators.receiveDatasetList(data);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function getWorkspace(id) {
  // XXX: Convert to number until we have ids from the server
  id = +id;

  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_profile/",
    data: { index: id },
    success: function (data) {
      // Create an action
      ServerActionCreators.receiveWorkspace(data);

      // Request first model for this workspace
      if (data.modelList && data.modelList.length > 0) {
        getModel(data.modelList[0]);
      }

      // Request datasets for this workspace
      if (data.datasetList) {
        data.datasetList.forEach(function (id) {
          getDataset(id);
        });
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function getModel(id) {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_model/" + id,
    success: function (data) {
      // Create an action
      ServerActionCreators.receiveModel({
        id: id,
        data: data
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function getDataset(id) {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/get_dataset/" + id,
    success: function (data) {
      // Reformat the data and create an action
      ServerActionCreators.receiveDataset(createDataset(id, data));
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(textStatus + ": " + errorThrown);
    }
  });
}

function createDataset(id, dataset) {
  // Set metadata
  var ds = {
    id: id
  };

  // Parse the csv data
  var data = d3.csvParse(dataset.csv);

  // Get the available features
  ds.features = d3.nest()
      .key(function(d) { return d.Feature; })
      .entries(data).map(function (d) {
        return d.key;
      }).map(function (feature, i) {
        // Only first feature active
        return {
          name: feature,
          active: i === 0
        };
      });

  // Nest by species, cell, and feature
  var nest = d3.nest()
      .key(function (d) { return d.Species; })
      .key(function (d) { return d.Cell; })
      .key(function (d) { return d.Feature; })
      .entries(data);

  // Get keys for time samples
  var timeKeys = data.columns.filter(function (d) {
    return !isNaN(+d);
  });

  // Reformat data
  ds.species = nest.map(function (d) {
    return {
      name: d.key,
      cells: d.values.map(function (d) {
        return {
          name: d.key,
          features: d.values.map(function (d) {
            return {
              name: d.key,
              values: timeKeys.map(function (key) {
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

  return ds;
}

function simulationParameters() {
  var model = ModelStore.getModel();
  var controls = SimulationControlStore.getControls();

  var trajectories = controls.parameters[controls.parameters.map(function (parameter) {
    return parameter.name;
  }).indexOf("numCells")].value;

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

// This needs to be stored somewhere for canceling the simulation
var taskId;

function runSimulation() {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/runmodel/" + ModelStore.getModel().fileName,
    data: simulationParameters(),
    success: function (data) {
      if (data.task_id) {
        taskId = data.task_id;
        pollSimulation();
      }
      else {
        var error = "Empty task_id. Simulation did not start successfully";
        ServerActionCreators.receiveSimulationOutput([], error);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      ServerActionCreators.receiveSimulationOutput([], textStatus + ": " + errorThrown);
    }
  });
}

function cancelSimulation() {
  setupAjax();

  $.ajax({
    type: "POST",
    url: "/terminate_model_run/",
    data: {
      task_id: taskId
    },
    success: function (data) {
      // Gets handled in pollSimulation
    },
    error: function (xhr, textStatus, errorThrown) {
      ServerActionCreators.receiveSimulationOutput([], textStatus + ": " + errorThrown);
    }
  });
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
      ServerActionCreators.receiveSimulationOutput([], textStatus + ": " + errorThrown);
    }
  });
}

function pollSimulation() {
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
      if (data.error) {
        if (timeOutStatusId > -1) {
          clearTimeout(timeOutStatusId);
        }

        ServerActionCreators.receiveSimulationOutput([], data.error);
      }
      else if (data.result) {
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

      ServerActionCreators.receiveSimulationOutput([], textStatus + ": " + errorThrown);
    }
  });
}

module.exports = {
  getWorkspaceList: getWorkspaceList,
  getModelList: getModelList,
  getDatasetList: getDatasetList,
  getModel: getModel,
  getDataset: getDataset,
  getWorkspace: getWorkspace,
  runSimulation: runSimulation,
  cancelSimulation: cancelSimulation
};
