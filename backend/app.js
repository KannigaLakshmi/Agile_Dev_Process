var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');
var mongoose = require('mongoose')

var port = process.env.PORT || 3000;

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(bodyParser.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());

// Define routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to the EDA397/DIT192 backend ExpressJS project!'});
});

require("./routes/shifts.routes") (app);
require("./routes/personnel.routes") (app);
require("./routes/departments.routes")(app);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        err_res['error'] = err;
    }
    res.status(err.status || 500);
    res.json(err_res);
});


const dbName = 'plannersApp'
mongodbURI = "mongodb://127.0.0.1:27017/plannersApp"


mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    
}).then(() => {
    console.log("Connection to mongoose esablished");
    //db = client.db(dbName)
    console.log(`Connected MongoDB: ${mongodbURI}`)
    console.log(`Database: ${dbName}`)
}).catch(err => {
    console.log("Could not connect to mongoose");
    console.log(err)
    process.exit();
})

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
});


module.exports = app;
