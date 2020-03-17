$("#phoneSignup").submit((e) => {
    e.preventDefault();
    axios.post('/phoneSignup', {
        _csrf: document.getElementById('_csrf').value,
        phone: document.getElementById('phone').value
    }).then(res => {
        if(res.data.err) {
            return alert(res.data.err);
        }
        $("#newUserId").val(res.data);
        $("#phoneSignup").addClass('hidden');
        $("#checkCode").removeClass('hidden');
    });
});

$("#checkCode").submit((e) => {
    e.preventDefault();
    axios.post('/checkCode', {
        _csrf: document.getElementById('_csrf').value,
        signup: true,
        userID: document.getElementById('newUserId').value,
        code: document.getElementById('code').value
    }).then(res => {
        if(res.data.err) {
            return alert(res.data.err);
        }
        console.log(res);
        $("#checkCode").addClass('hidden');
        $("#finishSignup").removeClass('hidden');
    });
});