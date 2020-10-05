'use strict';

const app = require('./initialize.js');
const config = require('config');

const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
const path = require('path');

app.use(compression());
app.use(cookieParser());

//Serve Gzipped Bundle (only works for Production env)
app.use('/static/scripts', function (req, res, next) {
  if(req.url.indexOf(".js") > -1){
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
  }
  next();
});

app.use('/static', express.static(path.resolve(__dirname, '../../static/')));

module.exports = app;