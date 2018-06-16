const express = require('express');
const engine = require('consolidate');
const logger = require('morgan');
const path = require('path');
global.appRoot = path.resolve(__dirname);

const app = express();
const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', engine.mustache);

app.use(express.static(__dirname + '/public'));

app.use('/markdown-knowledge-base', indexRouter);

app.listen(3006);