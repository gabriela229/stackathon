const express = require('express');
const cal = require('./google-calendar');

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
  const {workshopFileJSON, emailFileJSON, startDate, endDate} = req.body;
  onSubmitUserData(req.params.id, workshopFileJSON, emailFileJSON, startDate, endDate)
  .then(() => res.sendStatus(204))
  .catch(next);
});

module.exports = router;

const getAttendees = (emails, team) => {
   return emails.data.map( email => {
      if (team.includes(email.Name)) {
        return {email: email.Email, displayName: email.Name};
      }
  });
};

function sendInvites(start, end, data){
  const startTime = new Date(start);
  const endTime = new Date(end);
  const timeMin = startTime.toISOString();
  const timeMax = endTime.toISOString();
  let attendees = getAttendees(data.emails, [data.Instructor, data.fellowPoll]);
  getEventAndUpdate(data.id, timeMin, timeMax, data.Lecture, attendees)
    .then( () => {
      Promise.all([
        getEventAndUpdate(data.id, timeMin, timeMax, data.Review, attendees),
        getEventAndUpdate(data.id, timeMin, timeMax, data.ReviewQA, attendees),
        getEventAndUpdate(data.id, timeMin, timeMax, data.ReviewVideo, [data.Instructor]),
        getEventAndUpdate(data.id, timeMin, timeMax, data.Presentations, [data.Instructor])
      ]);
    })
    .then( () => {
      attendees = getAttendees(data.emails, [data.Instructor, ...data.fellowWS]);
      return getEventAndUpdate(data.id, timeMin, timeMax, data.Workshop, attendees);
    })
    .catch( err => console.log(err));
}

function getEventAndUpdate(id, timeMin, timeMax, q, attendees){
  let params = {
    timeMin,
    timeMax,
    q
  };
  return cal.Events.list(id, params)
    .then(json => {
      json.map( event => {
        updateEvent(id, event.id, event, attendees);
      });
    })
    .catch(err => {
      console.log('Error: listSingleEvents -' + err);
  });
}

function updateEvent(calId, eventId, event, attendees) {
  const evntParams = {
    sendNotifications: false
  };
  event.attendees = attendees;
	cal.Events.update(calId, eventId, event, evntParams)
		.then(resp => {
			console.log('updated event');
			return resp;
		})
		.catch(err => {
			console.log('Error: updatedEvent-' + err);
		});
}


function onSubmitUserData(id, attendees, emails, start, end){
      return Promise.all(attendees.data.map( ws => {
        let { Lecture, Workshop, 'Fellow (Does Poll)': fellowPoll, Instructor } = ws;
        let fellows = [];
        const keys = Object.keys(ws);
        keys.map( key => {
          if (key.toLowerCase().includes('fellow')){
            fellows.push(ws[key]);
          }
        });
        let data  = {
          id,
          Lecture,
          Workshop: `Workshop: ${Workshop}`,
          Review: `Review: ${Workshop}`,
          ReviewVideo: `Review Video: ${Workshop}`,
          ReviewQA: `Review Q&A: ${Workshop}`,
          Presentations: `Presentations: ${Workshop}`,
          fellowPoll,
          fellowWS: fellows,
          Instructor,
          emails
        };
        return new Promise( (resolve, reject) => {
          resolve(sendInvites(start, end, data));
        }
      );
    }))
    .catch(err => console.log(err));
}
