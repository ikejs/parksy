$("form").submit((e) => {
    e.preventDefault();
    clearFlash();
});

$("#phoneSignup").submit((e) => {
    axios.post('/phoneSignup', {
        _csrf: $("#_csrf").val(),
        phone: $("#phone").val(),
        country: $("#country").val()
    }).then(res => {
        if(res.data.errors) {
            return res.data.errors.map(error => {
                flash('errors', { msg: error });
            });
        }
        $("#newUserId").val(res.data);
        $("#phoneSignup").addClass('hidden');
        $("#checkCode").removeClass('hidden');
        flash('success', { msg: 'Code sent to: ' + $("#phone").val() });
    });
});

$("#checkCode").submit((e) => {
    axios.post('/checkCode', {
        _csrf: $("#_csrf").val(),
        signup: true,
        userID: $("#newUserId").val(),
        code: $("#code").val()
    }).then(res => {
        if(res.data.errors) {
            return res.data.errors.map(error => {
                alert(error);
            });
        }
        console.log(res);
        $("#checkCode").addClass('hidden');
        $("#finishSignup").removeClass('hidden');
    });
});

$("#finishSignup").submit((e) => {
    axios.post('/signup', {
        _csrf: $("#_csrf").val(),
        userID: $("#newUserId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        password: $('#password').val()
    }).then(res => {
        if(res.data.errors) {
            return res.data.errors.map(error => {
                alert(error);
            });
        } else if(res.data === "login") {
            window.location.href = "/login";
        }
    });
});