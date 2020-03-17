// Controllers
const indexController = require('../controllers/index');
const userController = require('../controllers/user');


// GETs
app.get('/', indexController.index);
app.get('/signup', userController.getSignup);


// POSTs
app.post('/phoneSignup', userController.postPhoneSignup);
app.post('/checkCode', userController.postCheckCode);
app.post('/signup', userController.postSignup);