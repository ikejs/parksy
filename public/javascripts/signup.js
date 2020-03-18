$("#phoneSignup").submit((e) => {
    e.preventDefault();
    axios.post('/phoneSignup', {
        _csrf: $("#_csrf").val(),
        phone: $("#phone").val()
    }).then(res => {
        if(res.data.errors) {
            return res.data.errors.map(error => {
                alert(error);
            });
        }
        $("#newUserId").val(res.data);
        $("#phoneSignup").addClass('hidden');
        $("#checkCode").removeClass('hidden');
    });
});

$("#checkCode").submit((e) => {
    e.preventDefault();
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
    e.preventDefault();
    axios.post('/signup', {
        _csrf: $("#_csrf").val(),
        userID: $("#newUserId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val()
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