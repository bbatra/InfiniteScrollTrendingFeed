const config = require('config')
const express = require('express');
const webpack = require('webpack');
const app = express();
import mongoose from 'mongoose';
const dbName = config.db.name;
const dbHost = config.db.host;

if (process.env.NODE_ENV === 'loc') {
    const webpackConfig = require('../../../webpack.config.loc.js').default;
    const webpackObj = {
        devMiddleware: require('webpack-dev-middleware'),
        config: webpackConfig,
        hotMiddleware: require('webpack-hot-middleware')
    };

    const compiler = webpack(webpackObj.config);

    app.use(webpackObj.devMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpackObj.hotMiddleware(compiler));
}

try{
  let promise = mongoose.connect(`${dbHost}/${dbName}`, {
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    reconnectTries: 3600,
    reconnectInterval: 1000
  });

  promise.then(
    () => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
      console.log('Database connection is open.');
    },

    err => {
      /** handle initial connection error */
      console.error('connection error:', err);
    }
  )
}
catch (e) {
  console.error('[Error] connecting to db (initialize.js) : ', e);
}

process.on('uncaughtException', function (err) {
  console.error('###################EXCEPTION############################'); //exception can only be caught here

  console.log(err);
  console.error('###################EXCEPTION############################');
});


process.on('unhandledRejection', function (err) {
  console.error('#####################REJECTION##########################'); //exception can only be caught here

  console.log(err);
  console.error('#####################REJECTION#########################');
});


module.exports = app;


