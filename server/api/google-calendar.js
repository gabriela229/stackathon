const CONFIG = require('./config');
const CalendarAPI = require('node-google-calendar');


let cal = new CalendarAPI(CONFIG);

module.exports = cal;
