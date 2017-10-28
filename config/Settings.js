const SERVICE_ACCT_ID = 'invite@gmail-auto-invitation.iam.gserviceaccount.com';
const key = require('./google-api.json').private_key;
const TIMEZONE = 'UTC-05:00';
const CALENDAR_ID = {
  primary: 'qm5fot3gdgut38nvhrip3ghc3k@group.calendar.google.com'
};

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.key = key;
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;
