const cal = require('./google-calendar');

const getAttendees = (emails, team) => {
  return emails.data.map( email => {
     if (team.includes(email.Name)) {
       return {email: email.Email, displayName: email.Name};
     }
 });
};

function convertTime(start, end){
  const startTime = new Date(start);
  const endTime = new Date(end);
  const timeMin = startTime.toISOString();
  const timeMax = endTime.toISOString();
  return {timeMin, timeMax};
}

function sendHotSeatRetroInvites(start, end, id, emails, instructors, lectureRoomId, q){
  const {timeMin, timeMax} = convertTime(start, end);
  console.log('timemax', timeMax);
  const attendees = getAttendees(emails, instructors);
  return getEventAndUpdate(id, timeMin, timeMax, q, [...attendees, {email: lectureRoomId}]);
}

function sendInvites(start, end, data){
  const {id, lecture, workshop, review, reviewVideo, reviewQA, presentations, fellowPoll, fellowWS, instructor, emails, lectureRoomId, workshopRoomId} = data;
  const {timeMin, timeMax} = convertTime(start, end);
  const instructorFellowPollEmail = getAttendees(emails, [instructor, fellowPoll]);

   return Promise.all([
       getEventAndUpdate(id, timeMin, timeMax, lecture, [...instructorFellowPollEmail, {email: lectureRoomId}]),
       getEventAndUpdate(id, timeMin, timeMax, review, [...instructorFellowPollEmail, {email: lectureRoomId}]),
       getEventAndUpdate(id, timeMin, timeMax, reviewQA, [...instructorFellowPollEmail, {email: lectureRoomId}])
   ])
   .then( () => {
     console.log('sendInvites 1st .then', workshop);
     const instructorEmail = getAttendees(emails, [instructor]);
     return Promise.all([
       getEventAndUpdate(id, timeMin, timeMax, reviewVideo, [...instructorEmail, {email: workshopRoomId}]),
       getEventAndUpdate(id, timeMin, timeMax, presentations, [...instructorEmail, {email: lectureRoomId}])
     ]);
   })
   .then( () => {
    console.log('sendInvites 2nd .then', workshop);
     const instructorFellowsEmail = getAttendees(emails, [instructor, ...fellowWS]);
      return getEventAndUpdate(id, timeMin, timeMax, workshop, [...instructorFellowsEmail, {email: workshopRoomId}]);
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
     return json.map( event => {
        updateEvent(id, event.id, event, attendees);
     });
   })
   .catch(err => {
     console.log('Error: listSingleEvents -' + err);
 });
}

function findEventsNoAttendees(id, timeMin, timeMax){
  let params = {
    timeMin,
    timeMax
  };
  return cal.Events.list(id, params)
    .then(json => {
      return json.filter( event => {
        console.log('event', event.summary, !!event.attendees);
        return !event.attendees;
      });
    })
    .then(eventsList => {
      let noAttendessEvents = [];
      eventsList.forEach((event) => {
        noAttendessEvents.push({[event.summary]: event.summary, startDate: event.start});
      });
      console.log('no attendees****', noAttendessEvents);
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
 return cal.Events.update(calId, eventId, event, evntParams)
   .then(resp => {
     console.log('updated event');
    //  console.log(resp.attendees);
     return resp;
   })
   .catch(err => {
     console.log('Error: updatedEvent-' + err);
   });
}


function onSubmitUserData(id, body){
  const {workshopFileJSON, emailFileJSON, startDate, endDate, lectureRoomId, workshopRoomId, hotSeat, retro} = body;
  let instructors = [];
     return Promise.all(workshopFileJSON.data.map( ws => {
       let {Lecture: lecture, Workshop: workshop, 'Fellow (Does Poll)': fellowPoll, Instructor: instructor } = ws;
       let fellows = [];
       const keys = Object.keys(ws);
       keys.map( key => {
         if (key.toLowerCase().includes('fellow')){
           fellows.push(ws[key]);
         }
       });
       if (!(instructors.includes(instructor))){
         instructors.push(instructor);
       }
       let data  = {
         id,
         lecture,
         workshop: `Workshop: ${workshop}`,
         review: `"Review: ${workshop}"`,
         reviewVideo: `"Review Video: ${workshop}"`,
         reviewQA: `"Review Q&A: ${workshop}"`,
         presentations: `"Presentations: ${workshop}"`,
         fellowPoll,
         fellowWS: fellows,
         instructor,
         emails: emailFileJSON,
         lectureRoomId,
         workshopRoomId
       };
       return sendInvites(startDate, endDate, data);
   }))
   .then( () => {
     console.log('All events sent!??');
     if (hotSeat){
       return sendHotSeatRetroInvites(startDate, endDate, id, emailFileJSON, instructors, lectureRoomId, '"Hot Seat');
     }
   })
   .then( () => {
      if (retro){
        return sendHotSeatRetroInvites(startDate, endDate, id, emailFileJSON, instructors, lectureRoomId, '"Retrospective');
      }
   })
   .then(() => {
    const {timeMin, timeMax} = convertTime(startDate, endDate);
    return findEventsNoAttendees(id, timeMin, timeMax);
   })
   .catch(err => console.log(err));
}

module.exports = onSubmitUserData;
