const { isAuthenticated, isEmailVerified } = passportConfig;

const { index } = indexController;
const { getSignup, getLogin, logout, getConfirmEmailToken, postPhoneSignup, postCheckCode, postSignup, postLogin, getAnotherEmailConfirmation } = userController;
const { getSellerDashboard, getNew, postNew } = sellerController;


// GETs
app.get('/', index);
app.get('/signup', getSignup);
app.get('/login', getLogin);
app.get('/logout', logout);
app.get('/confirm/:token', isAuthenticated, getConfirmEmailToken);
app.get('/send-email-confirmation/:userID', isAuthenticated, getAnotherEmailConfirmation);

app.get('/sell', isEmailVerified, getSellerDashboard);
app.get('/sell/new', isEmailVerified, getNew);


// POSTs
app.post('/phoneSignup', postPhoneSignup);
app.post('/checkCode', postCheckCode);
app.post('/signup', postSignup);
app.post('/login', postLogin);
app.post('/sell/new', postNew);