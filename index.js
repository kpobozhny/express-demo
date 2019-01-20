const startupDebugger = require('debug')('app:startup'); //'app:startup' is a namespace
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

//DB work
dbDebugger('Connected to the database...');

app.use(logger);
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/courses', courses);
app.use('/', home);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

// PORT
const port = process.env.PORT || 3000;
app.listen(3000, () => {console.log(`Listening on port ${port}...`)});
