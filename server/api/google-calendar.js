const CONFIG = require('./config/Settings');
const CalendarAPI = require('node-google-calendar');


let cal = new CalendarAPI(CONFIG);

module.exports = cal;
