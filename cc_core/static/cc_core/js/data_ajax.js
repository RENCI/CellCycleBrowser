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
            ds_res = json_response['profilelist'];
            resultstr = "profile list:\n";
            if (ds_res.length > 0) {
                $.each(ds_res, function(i, v) {
                    resultstr += "Profile " + (i+1) + '\n';
                    resultstr += "=========================\n"
                    resultstr += "name: " + v['name'] + '\n';
                    resultstr += "description: " + v['description'] + '\n';
                    resultstr += "value: " + v['value'] + '\n';
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