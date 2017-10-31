const api = require('express').Router();

api.use('/google', require('./google'));


api.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

module.exports = api;
