import React, { useState, useReducer, useEffect, createContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import * as Sentry from '@sentry/browser';

import { API_URL, defaultPortList } from '../utils/constants';

import { verifySession, setUser, setExpiresAt, setSessionID, setNS, setAuthView, setLogout } from '../utils/actions';
import { sessionReducer } from '../utils/reducers';
import { setSentryUser } from '../utils/utils';

import { message } from 'antd';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initSession = {
    currentAuthView: 'LOGIN',
    portName: '',
    namespace: 'common',
    sessionId: null,
    verifyingSession: false,
    user: undefined,
    modules: undefined,
    session: undefined,
    rtaPointCoordinates: '',
    mapDefaultCoordinates: undefined,
    mapDefaultZoom: undefined,
  };

  const [session, dispatch] = useReducer(sessionReducer, initSession);

  const [alert, setAlert] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const sessionId = localStorage.getItem('sessionId');
  const namespace = localStorage.getItem('namespace');

  const { i18n } = useTranslation(session.namespace);
  const t = i18n.getFixedT(i18n.language, session.namespace);

  const isIE = /*@cc_on!@*/ false || !!document.documentMode;
  const isEdge = !isIE && !!window.StyleMedia;

  const logoutStateInits = useCallback(() => {
    document.title = 'Port Activity App';
    localStorage.removeItem('sessionId');
    localStorage.removeItem('namespace');
    setAlert(null);
    setMenuOpen(false);
    dispatch(setLogout());
  }, [setAlert, setMenuOpen]);

  const apiCall = useCallback(
    async (method, path, data, sessionIdForTest, responseType) => {
      if (path.match(/^\//)) {
        throw new Error('Paths must not begin with slash "/"');
      }
      const url = `${API_URL}/${path}`;
      const { sessionId, ttl } = session;
      let headers = {};
      if (sessionIdForTest || sessionId) {
        headers['Authorization'] = 'Bearer ' + (sessionIdForTest ? sessionIdForTest : sessionId);
        headers['ClientTimeZone'] = moment.tz.guess();
      }
      let queryString = '';
      if (method === 'get' && data) {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          queryString = '?';
          keys.forEach(k => {
            queryString = `${queryString}${k}=${encodeURIComponent(data[k])}&`;
          });
        }
      }
      try {
        const result = await axios({
          method,
          url: url + queryString,
          data,
          headers,
          ...(responseType ? { responseType: responseType } : {}),
        });
        if (headers['Authorization'] && path !== 'login' && path !== 'logout') {
          // Note: Php session time to live is 1440 seconds = 24 minutes.
          //       We update expiresAt manually on client since we know that
          //       every api call extends session time to live.
          dispatch(setExpiresAt(Math.round(new Date().getTime() / 1000) + parseInt(ttl) - 10));
        }
        return result;
      } catch (error) {
        // note: 400 status codes and above are thrown as errors
        // note: 440 comes when session has expired
        if (error.message.match(/Request failed with status code 440/)) {
          logoutStateInits();
        } else {
          const responseErrorMessage = error.response && error.response.data && error.response.data.error;
          message.error(t(responseErrorMessage || 'Something unexpected happened'), 4);
          Sentry.captureException(error);
          throw error;
        }
      }
    },
    [session, t, logoutStateInits]
  );

  const login = useCallback(
    async (username, password) => {
      setAlert(null);
      try {
        const result = await apiCall('post', 'login', {
          email: username,
          password,
        });
        if (result && result.status === 200) {
          if (result.data.session_id) {
            const {
              data: {
                session_id: sessionId,
                user,
                session: { expires_ts: expiresAt, ttl },
                modules,
                rta_point_coordinates: rtaPointCoordinates,
                map_default_coordinates: mapDefaultCoordinates,
                map_default_zoom: mapDefaultZoom,
              },
            } = result;
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('namespace', session.namespace);
            dispatch(
              setUser({
                id: sessionId,
                user,
                expiresAt,
                ttl,
                modules,
                ns: session.namespace,
                verify: false,
                rtaPointCoordinates,
                mapDefaultCoordinates,
                mapDefaultZoom,
              })
            );
            setSentryUser(sessionId, modules, session, user);
            return true;
          }
        }
        setAlert({
          type: 'error',
          message: t('Login error'),
          description: t(result.data.message),
        });
      } catch (error) {
        return false;
      }
      return false;
    },
    [apiCall, setAlert, session, t]
  );

  const logout = useCallback(
    async skipApiCall => {
      // TODO: error handling
      !skipApiCall && apiCall('post', 'logout', {});
      logoutStateInits();
      window.history.pushState({}, null, '/');
    },
    [apiCall, logoutStateInits]
  );

  const register = async (firstname, lastname, code, email, password) => {
    const result = await apiCall('post', 'register', {
      first_name: firstname,
      last_name: lastname,
      code: code,
      email: email,
      password: password,
    });
    if (result && result.status === 200) {
      const {
        data: {
          session_id: sessionId,
          user,
          session: { expires_ts: expiresAt, ttl },
          modules,
          rta_point_coordinates: rtaPointCoordinates,
          map_default_coordinates: mapDefaultCoordinates,
          map_default_zoom: mapDefaultZoom,
        },
      } = result;
      if (sessionId) {
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('namespace', session.namespace);
        dispatch(
          setUser({
            id: sessionId,
            user,
            expiresAt,
            ttl,
            modules,
            ns: session.namespace,
            verify: false,
            rtaPointCoordinates,
            mapDefaultCoordinates,
            mapDefaultZoom,
          })
        );
        setSentryUser(sessionId, modules, session, user);
        return true;
      }
    }
    setAlert({
      type: 'error',
      message: t('Register error'),
      description: t(result.data.error),
    });
    return false;
  };

  const requestPasswordReset = async (email, namespace) => {
    const result = await apiCall('post', 'request-password-reset', {
      email: email,
      port: namespace,
    });
    if (result && result.status === 200) {
      // TODO: show success every time to prevent email phishing
      return true;
    }
    setAlert({
      type: 'error',
      message: t('Password reset error'),
      description: t(result.data.error),
    });
    return false;
  };

  const resetPassword = async (password, token) => {
    const result = await apiCall('post', 'reset-password', {
      password: password,
      token: token,
    });
    if (result && result.status === 200) {
      // TODO: show success every time to prevent email phishing
      return true;
    }
    setAlert({
      type: 'error',
      message: t('Password reset error'),
      description: t(result.data.error),
    });
    return false;
  };

  const setNamespace = ns => {
    // TODO: set api path according to namespace
    dispatch(setNS(ns));
  };

  const setCurrentAuthView = view => {
    if ((alert && alert.type === 'error') || view !== 'LOGIN') {
      setAlert(null);
    }
    dispatch(setAuthView(view));
  };

  const setSession = useCallback(async () => {
    if (sessionId === session.sessionId) {
      return;
    }
    if (sessionId && namespace) {
      dispatch(verifySession(true));
      try {
        const result = await apiCall('get', 'session', {}, sessionId);
        const {
          data: {
            user,
            session: { expires_ts: expiresAt, ttl },
            modules,
            rta_point_coordinates: rtaPointCoordinates,
            map_default_coordinates: mapDefaultCoordinates,
            map_default_zoom: mapDefaultZoom,
          },
        } = result;
        dispatch(
          setUser({
            id: sessionId,
            user,
            expiresAt,
            ttl,
            modules,
            ns: namespace,
            verify: false,
            rtaPointCoordinates,
            mapDefaultCoordinates,
            mapDefaultZoom,
          })
        );
        setSentryUser(sessionId, modules, session, user);
      } catch (error) {
        dispatch(verifySession(false));
      }
    }
  }, [apiCall, namespace, sessionId, session]);

  useEffect(() => {
    setSession();
    // TODO: fixme
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (session === 0) {
      dispatch(setSessionID(sessionId));
    }
  }, [session, sessionId]);

  const sessionObserver = useCallback(() => {
    if (sessionId && session.expiresAt && session.expiresAt * 1000 - new Date().getTime() < 1000) {
      // session expiring (soon), do logout so no hanging UI without permission there
      logout(false); // still do logout call to make sure session is expired
    }
  }, [logout, session, sessionId]);

  useEffect(() => {
    const id = setInterval(sessionObserver, 10 * 1000);
    return () => clearInterval(id);
  }, [sessionObserver]);

  const portObject = defaultPortList.find(port => port.value === session.namespace);

  return (
    <UserContext.Provider
      value={{
        currentAuthView: session.currentAuthView,
        portName: portObject ? portObject.label : session.namespace,
        namespace: session.namespace,
        sessionId: session.sessionId,
        verifyingSession: session.verifyingSession,
        user: session.user,
        modules: session.modules,
        rtaPointCoordinates: session.rtaPointCoordinates,
        mapDefaultCoordinates: session.mapDefaultCoordinates,
        mapDefaultZoom: session.mapDefaultZoom,
        login: login,
        logout: logout,
        apiCall: apiCall,
        register: register,
        requestPasswordReset: requestPasswordReset,
        resetPassword: resetPassword,
        setNamespace: setNamespace,
        setCurrentAuthView: setCurrentAuthView,
        menuOpen: menuOpen,
        setMenuOpen: setMenuOpen,
        alert: alert,
        setAlert: setAlert,
        isIE: isIE,
        isEdge: isEdge,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
