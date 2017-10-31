const express = require('express');
const app = express();
const path = require('path');

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
