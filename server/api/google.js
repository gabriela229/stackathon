const express = require('express');
const cal = require('./google-calendar');
const onSubmitUserData = require('./helpers');

const router = express.Router();

router.get('/', (req, res, next) => {
  cal.CalendarList.list({
    showHidden: true
  })
  .then(calendars => {
      res.send(calendars);
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  onSubmitUserData(req.params.id, req.body)
  .then(() => res.sendStatus(204))
  .catch(next);
});

module.exports = router;

