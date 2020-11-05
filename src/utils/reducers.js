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
  SET_PORTNAME,
  SET_SESSION_ID,
  SET_LOGOUT,
  SET_EXPIRES_AT,
} from './constants.js';

export const cardReducer = (state, action) => {
  switch (action.type) {
    case CANCEL:
      return {
        showAddTimestamp: false,
        showSendNotification: false,
        showRecommendTime: false,
        showRecommendTimeVis: false,
        showSendMessage: false,
      };

    case SHOW_ADD_TIMESTAMP:
      return {
        showAddTimestamp: true,
        showSendNotification: false,
        showRecommendTime: false,
        showRecommendTimeVis: false,
        showSendMessage: false,
      };

    case SHOW_SEND_NOTIFICATION:
      return {
        showAddTimestamp: false,
        showSendNotification: true,
        showRecommendTime: false,
        showRecommendTimeVis: false,
        showSendMessage: false,
      };

    case SHOW_RECOMMEND_TIME:
      return {
        showAddTimestamp: false,
        showSendNotification: false,
        showRecommendTime: true,
        showRecommendTimeVis: false,
        showSendMessage: false,
      };

    case SHOW_RECOMMEND_TIME_VIS:
      return {
        showAddTimestamp: false,
        showSendNotification: false,
        showRecommendTime: false,
        showRecommendTimeVis: true,
        showSendMessage: false,
      };

    case SHOW_SEND_MESSAGE:
      return {
        showAddTimestamp: false,
        showSendNotification: false,
        showRecommendTime: false,
        showRecommendTimeVis: false,
        showSendMessage: true,
      };

    default:
      return state;
  }
};

export const sessionReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        sessionId: action.id,
        user: action.user,
        namespace: action.ns,
        verifyingSession: action.verify,
        expiresAt: action.expiresAt,
        ttl: action.ttl,
        modules: action.modules,
        rtaPointCoordinates: action.rtaPointCoordinates,
        mapDefaultCoordinates: action.mapDefaultCoordinates,
        mapDefaultZoom: action.mapDefaultZoom,
      };

    case SET_EXPIRES_AT:
      return {
        ...state,
        expiresAt: action.expiresAt,
      };

    case SET_AUTHVIEW:
      return {
        ...state,
        currentAuthView: action.currentAuthView,
      };

    case SET_NAMESPACE:
      return {
        ...state,
        namespace: action.namespace,
      };

    case SET_PORTNAME:
      return {
        ...state,
        portName: action.portName,
      };

    case SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.id,
      };

    case VERIFY_SESSION:
      return {
        ...state,
        verifyingSession: action.state,
      };

    case SET_LOGOUT:
      return {
        ...state,
        currentAuthView: 'LOGIN',
        portName: '',
        namespace: 'common',
        sessionId: null,
        verifyingSession: false,
        user: undefined,
        modules: undefined,
        session: undefined,
        rtaPointCoordinates: '',
      };

    default:
      return state;
  }
};
