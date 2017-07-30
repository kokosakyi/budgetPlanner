const env = require('./env');

const express = require('express');

const app = express();

const router = express.Router();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const config = require('./config/database');

const path = require('path');

const bodyParser = require('body-parser');

const cors = require('cors');

const port = process.env.PORT || 8080;

// DATABASE Connection
mongoose.connect(config.uri, (err)=>{
    // Check if database was able to connect.
    if (err) {
        console.log('Could not connect to the database.', err);
    }
    else {
        console.log('Connected to ' + config.db);
    }
});

// Middleware
app.use(cors({ origin: 'http://localhost:4200' })); // Allows cross origin in development only
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public')); // Provide static directory for frontend
