const newrelic = require('newrelic');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/users');

const app = express();

VAR CUSTOM_PARAMETERS = {
    'NODENAME': PROCESS.ENV.K8S_NODE_NAME,
    'NODEIP': PROCESS.ENV.K8S_HOST_IP,
    'PODNAME': PROCESS.ENV.K8S_POD_NAME,
    'PODIP': PROCESS.ENV.K8S_POD_IP,
    'NAMESPACE': PROCESS.ENV.K8S_POD_NAMESPACE,
    'NAMESPACENAME': PROCESS.ENV.K8S_POD_NAMESPACE
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  newrelic.addCustomAttributes(CUSTOM_PARAMETERS);
  next();
});

if (process.env.NODE_ENV !== 'test') { app.use(logger('dev')); }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  const message = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err,
  });
});
/* eslint-enable no-unused-vars */

module.exports = app;
