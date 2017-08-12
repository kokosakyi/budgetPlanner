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

const authentication = require('./routes/authentication')(router); // Import Authentication Routes

const projects = require('./routes/projects')(router); // Import Projects Routes

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
//app.use(express.static(__dirname + '/public')); // Provide static directory for frontend
app.use(express.static(__dirname + '/client/dist'));
app.use('/authentication', authentication); // Use Authentication routes in application
app.use('/projects', projects); // Use the Projects routes in application

// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(port, () => {
  console.log('Listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');
});