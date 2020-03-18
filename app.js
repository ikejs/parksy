// import node modules
dotenv = require('dotenv').config({ path: '.env' });;
mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectID;
bcrypt = require('bcrypt');
express = require('express');
session = require('express-session');
exphbs = require("express-handlebars");
expressStatusMonitor = require('express-status-monitor');
bodyParser = require('body-parser');
flash = require('express-flash');
compression = require('compression');
logger = require('morgan');
lusca = require('lusca');
MongoStore = require('connect-mongo')(session);
path = require('path');
passport = require('passport');
sass = require('node-sass-middleware');
errorHandler = require('errorhandler');
passportConfig = require('./config/passport');
twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
validatePhone = require('phone');
validator = require('validator');
sgMail = require('@sendgrid/mail');

// for cleanup tasks
sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// import config files
require('./config/mongodb');
require('./config/sendgrid');
require('./config/models');
require('./config/express');
require('./config/errorHandler');
require('./config/controllers');
require('./config/routes');


app.listen(process.env.PORT || 5000);
