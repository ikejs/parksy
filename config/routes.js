// GETs
app.get('/', indexController.index);
app.get('/signup', userController.getSignup);
app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);


// POSTs
app.post('/phoneSignup', userController.postPhoneSignup);
app.post('/checkCode', userController.postCheckCode);
app.post('/signup', userController.postSignup);
app.post('/login', userController.postLogin);