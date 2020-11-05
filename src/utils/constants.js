export const defaultPortList = [
  { key: 'gavle', label: 'Gävle', value: 'gavle' },
  { key: 'rauma', label: 'Rauma', value: 'rauma' },
];

export const defaultTimestampTypes = ['Estimated', 'Planned', 'Actual', 'Recommended', 'Required'];

export const BASE_URL = `${window.location.protocol}//${window.location.host}`;
export const API_URL = process.env.REACT_APP_API_BASE;
export const TRANSLATIONS_API_KEY = process.env.REACT_APP_TRANSLATIONS_API_KEY;
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const TESTING_URL = 'https://spia-testing.ddns.net/api/v1';
export const STAGING_URL = 'https://spia-staging.ddns.net/api/v1';
export const NOTIFICATIONS_LIMIT = 100;
export const LOGISTICS_LIMIT = 100;
export const PAGINATION_LIMIT = 10;

export const CANCEL = 'CANCEL';
export const SHOW_ADD_TIMESTAMP = 'SHOW_ADD_TIMESTAMP';
export const SHOW_SEND_NOTIFICATION = 'SHOW_SEND_NOTIFICATION';
export const SHOW_RECOMMEND_TIME = 'SHOW_RECOMMEND_TIME';
export const SHOW_RECOMMEND_TIME_VIS = 'SHOW_RECOMMEND_TIME_VIS';
export const SHOW_SEND_MESSAGE = 'SHOW_SEND_MESSAGE';
export const VERIFY_SESSION = 'VERIFYING_SESSION';
export const SET_USER = 'SET_USER';
export const SET_EXPIRES_AT = 'SET_EXPIRES_AT';
export const SET_AUTHVIEW = 'SET_AUTHVIEW';
export const SET_NAMESPACE = 'SET_NAMESPACE';
export const SET_PORTNAME = 'SET_PORTNAME';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_LOGOUT = 'SET_LOGOUT';

export const TIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const TIME_FORMAT_WITH_TIME_ZONE = 'DD.MM.YYYY HH:mmZ';
