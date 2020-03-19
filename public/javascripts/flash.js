flash = (type, { msg }) => {
    if(type === 'errors') {
        $("#danger-alert").html(msg);
        $('#flash-danger').removeClass("hidden");
    }
    if(type === 'info') {
        $("#info-alert").html(msg);
        $('#flash-info').removeClass("hidden");
    }
    if(type === 'success') {
        $("#success-alert").html(msg);
        $('#flash-success').removeClass("hidden");
    }
    if(type === 'warning') {
        $("#warning-alert").html(msg);
        $('#flash-warning').removeClass("hidden");
    }
}

clearFlash = () => {
    $('#flash-danger').addClass("hidden");
    $('#flash-info').addClass("hidden");
    $('#flash-success').addClass("hidden");
    $('#flash-warning').addClass("hidden");

    $("#danger-alert").html('');
    $("#info-alert").html('');
    $("#success-alert").html('');
    $("#warning-alert").html('');
}