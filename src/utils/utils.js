import * as Sentry from '@sentry/browser';

export function getUniqueObjects(arr, comp) {
  const uniq = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e])
    .map(e => arr[e]);
  return uniq;
}

export function formatTime(date, timeOnly = false) {
  const dateObj = new Date(date);

  let d = dateObj.getDate();
  let m = dateObj.getMonth() + 1;
  let y = dateObj.getFullYear();
  let hh = dateObj.getHours();
  let mm = dateObj.getMinutes();

  // TODO Better handling for timezones
  let tz = Math.abs(dateObj.getTimezoneOffset() / 60);

  let timeString = `${d}.${m}.${y} ${hh}:${mm < 10 ? '0' + mm : mm} (GMT+0${tz})`;

  if (timeOnly) {
    timeString = `${hh}:${mm < 10 ? '0' + mm : mm} (GMT+0${tz})`;
  }

  return timeString;
}

export function UpperCase(string) {
  return string.substr(0, 1).toUpperCase() + string.substr(1);
}

export function randomCode() {
  return Math.floor(Math.random() * 90000) + 10000;
}

export const setSentryUser = (sessionId, modules, session, user) => {
  // TODO: don't send Personally Identifiable Information to sentry
  Sentry.setUser({
    id: user.id,
    username: user.email,
    modules: modules,
    permissions: user.permissions,
    role: user.role,
    sessionId: sessionId,
    session: session,
  });
  // Due to bug in sentrys setUser, only id and username are sent,
  // so tet the user info as extra data
  Sentry.setExtra('userInfo', {
    id: user.id,
    username: user.email,
    modules: modules,
    permissions: user.permissions,
    role: user.role,
    sessionId: sessionId,
    session: session,
  });
};

export const getEnvironmentName = hostname => {
  const map = {
    'qa-rauma.portactivity.fi': 'qa-rauma',
    'rauma.portactivity.fi': 'prod-rauma',
    'qa-gavle.portactivity.se': 'qa-gavle',
    'gavle.portactivity.se': 'prod-gavle',
    'www.portactivity.se': 'prod-gavle',
    'portactivity.se': 'prod-gavle',
    'spia-staging.ddns.net': 'staging',
    'spia-testing.ddns.net': 'testing',
  };
  if (map[hostname]) {
    return map[hostname];
  }
  return 'development';
};
