const passportConfig = require('./passport');

// controllers
const indexController = require('../controllers/index');


app.get('/', indexController.index);
app.get('/account', passportConfig.isAuthenticated, indexController.index);
