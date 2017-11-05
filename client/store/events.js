import axios from 'axios';

const UPDATE_EVENTS = 'UPDATE_EVENTS';

export function updateEvents(events){
  return {type: UPDATE_EVENTS, events};
}

export function modifyEvents(workshopFile, emailFile, calendarId, startDate, endDate){
  console.log('workshopFile, emailFile, calendarId, startDate, endDate', workshopFile, emailFile, calendarId, startDate, endDate )
  const data = new FormData();
  data.append('workshopFile', workshopFile);
  data.append('emailFile', emailFile);
  data.append('startDate', startDate);
  data.append('endDate', endDate);
  console.log(data, 'data');
  return (dispatch) => {
    return axios.put(`/api/google/${calendarId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
 })
      // .then(res => res.data)
      // .then( events => {
      //   dispatch(updateEvents(events));
      // })
      .catch(err => console.log(err));
  };
}


export default function reducer(state = [], action){
  switch (action.type){
    case UPDATE_EVENTS:
      return action.events;
    default:
      return state;
  }
}
