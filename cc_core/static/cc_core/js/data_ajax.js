function request_dataset_list_ajax() {
    $.ajax({
        type: "POST",
        url: '/get_dataset_list/',
        success: function (json_response) {
            console.log(json_response);
            return true;
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText + ". Error message: " + errmsg);
            return false;
        }
    });
}