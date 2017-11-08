import axios from 'axios';
import Papa from 'papaparse';


const UPDATE_EVENTS = 'UPDATE_EVENTS';

export function updateEvents(events){
  return {type: UPDATE_EVENTS, events};
}

export function modifyEvents(workshopFile, emailFile, calendarId, startDate, endDate){
    return (dispatch) => {
      return Promise.all([
        Papa.parsePromise(workshopFile, {header: true, beforeFirstChunk: (chunk) => {
          var rows = chunk.split( /\r\n|\r|\n/ );
          const newRows = rows.slice(2);
          return newRows.join('\n');
        }}),
        Papa.parsePromise(emailFile, {header: true})
      ])
      .then(([workshopFileJSON, emailFileJSON]) => {
        const data = {workshopFileJSON, emailFileJSON, startDate, endDate};
      return axios.put(`/api/google/${calendarId}`, data)
    // .then(res => res.data)
    // .then( events => {
    //   dispatch(updateEvents(events));
    // })
   })
    .catch(err => console.log(err));
    };
}

Papa.parsePromise = function(file, config) {
  return new Promise(function(complete, error) {
    const options = Object.assign({}, config, {complete, error});
    Papa.parse(file, options);
  });
};

export default function reducer(state = [], action){
  switch (action.type){
    case UPDATE_EVENTS:
      return action.events;
    default:
      return state;
  }
}
