import { addSeconds, format } from 'date-fns';

function timeFromSeconds(seconds: number) {
  const helperDate = addSeconds(new Date(0), seconds);
  return format(helperDate, 'mm:ss');
}

export default timeFromSeconds;
