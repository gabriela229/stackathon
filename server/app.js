const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') require('../secrets');
if (process.env.NODE_ENV === 'production'){
  process.env.key = JSON.parse(process.env.key);
}


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/vendor', express.static(path.join(__dirname, '..', 'node_modules')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/api', require('./api'));

app.get('/*', (req, res, next) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));


app.use(function (err, req, res, next) {
  console.log(err, err.stack);
  res.status(500).send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
