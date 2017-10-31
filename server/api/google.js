const express = require('express');
const cal = require('./google-calendar');

const router = express.Router();

router.get('/', (req, res, next) => {
  cal.CalendarList.list({
    showHidden: true
  })
  .then(calendars => {
    console.log(calendars);
      res.send(calendars);
    })
    .catch(next);
});


module.exports = router;







// const calendarId = CONFIG.calendarId.primary;
// // const testFile = require('../../test/inviteTest');
// // const testEmails = require('../../test/emailList');
// const Papa = require('papaparse');


// const getAttendees = (emails, team) => {
//    return emails.data.map( email => {
//       if (team.includes(email.Name)) {
//         return {email: email.Email, displayName: email.Name};
//       }
//   });
// };

// function sendInvites(start, end, data){
//   const timeMin = start.toISOString();
//   const timeMax = end.toISOString();
//   let attendees = getAttendees(data.emails, [data.Instructor, data.fellowPoll]);
//   // console.log(attendees)
//   getEventAndUpdate(timeMin, timeMax, data.Lecture, attendees)
//     .then( () => {
//       Promise.all([
//         getEventAndUpdate(timeMin, timeMax, data.Review, attendees),
//         getEventAndUpdate(timeMin, timeMax, data.ReviewVideo, attendees),
//         getEventAndUpdate(timeMin, timeMax, data.ReviewQA, attendees),
//         getEventAndUpdate(timeMin, timeMax, data.Presentations, attendees)
//       ]);
//     })
//     .then( () => {
//       attendees = getAttendees(data.emails, [data.Instructor, ...data.fellowWS]);
//       getEventAndUpdate(timeMin, timeMax, data.Workshop, attendees);
//     })
//     .catch( err => console.log(err));
// }

// function getEventAndUpdate(timeMin, timeMax, q, attendees){
//   let params = {
//     timeMin,
//     timeMax,
//     q
//   };

//   return cal.Events.list(calendarId, params)
//     .then(json => {
//       json.map( event => {
//         updateEvent(calendarId, event.id, event, attendees);
//       });
//     })
//     .catch(err => {
//       console.log('Error: listSingleEvents -' + err);
//   });
// }

// function updateEvent(calId, eventId, event, attendees) {
//   const evntParams = {
//     sendNotifications: false
//   };
//   event.attendees = attendees;
//   // console.log(event);
// 	cal.Events.update(calId, eventId, event, evntParams)
// 		.then(resp => {
//       console.log(resp);
// 			console.log('updated event');
// 			return resp;
// 		})
// 		.catch(err => {
// 			console.log('Error: updatedEvent-' + err);
// 		});
// }

// Papa.parsePromise = function(file, config) {
//   return new Promise(function(complete, error) {
//     const options = Object.assign({}, config, {complete, error})
//     Papa.parse(file, options);
//   });
// };

// function onSubmitUserData(attendeeFile, emailFile, start, end){
//   Promise.all([
//     Papa.parsePromise(emailFile, {header: true}),
//     Papa.parsePromise(attendeeFile, {header: true})
//   ])
//     .then(([emails, attendees]) => {
//       attendees.data.map( ws => {
//         let { Lecture, Workshop, 'Fellow (Does Poll)': fellowPoll, Instructor } = ws;
//         let fellows = [];
//         const keys = Object.keys(ws);
//         keys.map( key => {
//           if (key.toLowerCase().includes('fellow')){
//             fellows.push(ws[key]);
//           }
//         });
//         let data  = {
//           Lecture,
//           Workshop: `Workshop: ${Workshop}`,
//           Review: `Review: ${Workshop}`,
//           ReviewVideo: `Review Video: ${Workshop}`,
//           ReviewQA: `Review Q&A: ${Workshop}`,
//           Presentations: `Presentations: ${Workshop}`,
//           fellowPoll,
//           fellowWS: fellows,
//           Instructor,
//           emails
//         };

//         sendInvites(start, end, data);
//       });
//     })
//     .catch(err => console.log(err));
// }

// const startDate = new Date(2017, 10, 20, 0, 0);
// // console.log(startDate);
// const endDate = new Date(2017, 10, 23, 0, 0);
// // console.log(endDate)

// // onSubmitUserData(testFile, testEmails, startDate, endDate);

// // const addResource = (lectureLocation, workshopLocation) => {

// // }
