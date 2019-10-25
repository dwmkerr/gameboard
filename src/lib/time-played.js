import moment from 'moment';

export default function timePlayed(time) {
  //  Throw if we do not have a DateTime.
  if (!(time instanceof Date)) throw new Error('\'time\' should be an instance of type \'Date\'');

  //  Get a consistent 'now', then work out how many days and weeks have passed.
  console.log('getting now...');
  const now = moment(Date.now());
  const timeMoment = moment(time);
  console.log(`moments are now: ${now.toString()}, timeMoment: ${timeMoment}`);
  const days = now.diff(timeMoment, 'days');
  const weeks = now.diff(timeMoment, 'weeks');

  //  If it is the same day, just return the time.
  if (days === 0) return timeMoment.format('LT'); // e.g. 8:30 PM

  //  One day ago is just 'Yesterday'.
  if (days === -1) return 'Yesterday';

  //  If we are more than a day ago, but in the same week, use the day of the week.
  if (weeks === 0) return timeMoment.format('ddd');

  //  Otherwise, we just return the short date.
  return timeMoment.format('D/M/YY');
}
