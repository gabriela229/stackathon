import axios from 'axios';

const GET_CALENDARS = 'GET_CALENDARS';

export function getCalendars(calendars){
  return {type: GET_CALENDARS, calendars};
}

export function fetchCalendars(){
  return (dispatch) => {
    return axios.get('/api/google')
      .then(res => res.data)
      .then( calendars => {
        dispatch(getCalendars(calendars.items));
      })
      .catch(err => console.log(err));
  };
}


export default function reducer(state = [], action){
  switch (action.type){
    case GET_CALENDARS:
      return action.calendars;
    default:
      return state;
  }
}
