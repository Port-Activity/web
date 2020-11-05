import {
  CANCEL,
  SHOW_ADD_TIMESTAMP,
  SHOW_SEND_NOTIFICATION,
  SHOW_RECOMMEND_TIME,
  SHOW_RECOMMEND_TIME_VIS,
  SHOW_SEND_MESSAGE,
  VERIFY_SESSION,
  SET_USER,
  SET_AUTHVIEW,
  SET_NAMESPACE,
  SET_SESSION_ID,
  SET_LOGOUT,
  SET_EXPIRES_AT,
} from './constants.js';

export const cancel = () => ({
  type: CANCEL,
});

export const showAddTimestamp = () => ({
  type: SHOW_ADD_TIMESTAMP,
});

export const showSendNotification = () => ({
  type: SHOW_SEND_NOTIFICATION,
});

export const showRecommendTime = () => ({
  type: SHOW_RECOMMEND_TIME,
});

export const showRecommendTimeVis = () => ({
  type: SHOW_RECOMMEND_TIME_VIS,
});

export const showSendMessage = () => ({
  type: SHOW_SEND_MESSAGE,
});

export const verifySession = bool => ({
  type: VERIFY_SESSION,
  state: bool,
});

//TODO: rename this?
export const setUser = data => ({
  type: SET_USER,
  ...data,
});

export const setExpiresAt = expiresAt => ({
  type: SET_EXPIRES_AT,
  expiresAt,
});

export const setAuthView = view => ({
  type: SET_AUTHVIEW,
  currentAuthView: view,
});

export const setNS = namespace => ({
  type: SET_NAMESPACE,
  namespace: namespace,
});

export const setSessionID = id => ({
  type: SET_SESSION_ID,
  id: id,
});

export const setLogout = () => ({
  type: SET_LOGOUT,
});
