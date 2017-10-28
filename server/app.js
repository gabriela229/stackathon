const express = require('express');
const app = express();
const CONFIG = require('../config/Settings');
const CalendarAPI = require('node-google-calendar');
const calendarId = CONFIG.calendarId.primary;


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

let cal = new CalendarAPI(CONFIG);

let params = {
  timeMin: '2017-10-30T06:00:00+08:00',
  timeMax: '2017-10-31T22:00:00+08:00',
  q: 'workshop',
  singleEvents: true,
  orderBy: 'startTime'
}; 	//Optional query parameters referencing google APIs

cal.Events.list(calendarId, params)
.then(json => {
  //Success
  console.log('List of events on calendar within time-range:');
  console.log(json);
}).catch(err => {
  //Error
  console.log('Error: listSingleEvents -' + err);
});

