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
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function request_profile_list_ajax() {
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
        success: function (json_response) {
            ds_res = json_response;
            resultstr = "profile list:\n";
            if (ds_res.length > 0) {
                $.each(ds_res, function(i, v) {
                    resultstr += "Profile " + (i+1) + '\n';
                    resultstr += "=========================\n"
                    resultstr += "name: " + v['cell'][0]['name'] + '\n';
                    resultstr += "description: " + v['cell'][0]['description'] + '\n';
                    resultstr += "value: " + v['cell'][0]['value'] + '\n';
                    resultstr += "=========================\n"
                });
            }
            alert(resultstr);
            return true;
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText + ". Error message: " + errmsg);
            return false;
        }
    });
}

function run_model_ajax(model_input_file_name) {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });
    var species_dict = {
        "53BP1": $('#53BP1').val(),
        "PCNA": $('#PCNA').val(),
        "p16": $('#p16').val()
    };
    
    $.ajax({
        type: "POST",
        url: '/runmodel/' + model_input_file_name,
        data: {
            trajectories: $('#trajectories').val(),
            end: $('#end').val(),
            species: JSON.stringify(species_dict)
        },
        success: function (json_response) {
            task_id = json_response.task_id;
            if(task_id) {
                $('#task_id').val(task_id);
                $('#simulation-status-info').show();
                window.location.reload();
            }
            else {
                console.log("returned task_id is empty, model run did not start successfully.")
            }

        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText + ". Error message: " + errmsg);
        }
    });
}


function update_simulation_status(task_id) {
    sim_status_timeout_id=-1;
    // disable run model button to prevent it from being clicked again
    $('#btn-run-model').attr('disabled', 'disabled');
    $.ajax({
        dataType: "json",
        cache: false,
        timeout: 60000,
        type: "POST",
        url: '/check_task_status/',
        data: {
            task_id: task_id
        },
        success: function(data) {
            if(data.result) {
                $("#loading").html('');
                if(sim_status_timeout_id > -1)
                    clearTimeout(sim_status_timeout_id);
                // enable run model button now that model run is done
                $("#btn-run-model").removeAttr('disabled');
                $('#task_id').val('');
                request_url = '/get_model_result/' + data.result;
                $("#simulation-status-info").load(request_url);
                $('#simulation-status-info').show();
            }
            // only check status again in 5 seconds when $("#loading") is not
            // cleared up by success status above
            else if($("#loading").html()) {
                $("#loading").html($("#loading").html() + ".");
                sim_status_timeout_id = setTimeout(function () {
                    update_simulation_status(task_id);
                }, 5000);
            }
        },
        error: function (xhr, errmsg, err) {
            if(sim_status_timeout_id > -1)
                clearTimeout(sim_status_timeout_id);
            $("#btn-run-model").removeAttr('disabled');
            console.log("Simulation run errored out: " + errmsg);
            alert("Simulation run errored out: " + errmsg);
        }
    });
}

$(document).ready(function () {
    var task_id = $('#task_id').val();
    if (task_id)
        update_simulation_status(task_id);
});