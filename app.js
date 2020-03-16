const express = require('express');
const sass = require('node-sass-middleware');

// import config files
import './config/dotenv';
import './config/errorHandler';
import './config/express';
import './config/handlebars';
import './config/mongodb';
import './config/passport';
import './config/routes';


const app = express();

