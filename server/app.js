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
  timeMax: '2017-11-04T22:00:00+08:00',
  q: 'icebreakers',
  singleEvents: true,
  orderBy: 'startTime'
};

cal.Events.list(calendarId, params)
  .then(json => {
    // console.log('List of events on calendar within time-range:');
    // console.log(json);
    json.map( event => {
      updateEvent(calendarId, event.id, event);
    });
  })
  .catch(err => {
    console.log('Error: listSingleEvents -' + err);
});

function updateEvent(calId, eventId, event) {
  const evntParams = {
    sendNotifications: true
  };
  event.location = 'The Oasis';
  event.attendees = [{ email: 'gmedina229@gmail.com'} ];
  console.log(event);
	cal.Events.update(calId, eventId, evntParams, event)
		.then(resp => {
			console.log('updated event:');
			console.log(resp);
			return resp;
		})
		.catch(err => {
			console.log('Error: updatedEvent-' + err);
		});
}
