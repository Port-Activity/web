import { useState, useEffect, useCallback, useContext } from 'react';
import * as Sentry from '@sentry/browser';

import { UserContext } from '../context/UserContext';

const useApi = (method, path, firstParams, callback) => {
  const { apiCall } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (cancelled, nextParams) => {
      setLoading(true);
      const params = nextParams || firstParams;
      try {
        const { data } = await apiCall(method, path, params);
        if (!cancelled) {
          setData(data);
          setLoading(false);
          if (callback) {
            callback(data);
          }
        }
      } catch (e) {
        const responseErrorMessage = e.response && e.response.data && e.response.data.error;
        setError(responseErrorMessage || 'Oops! Something went wrong.');
        Sentry.captureException(e);
        setLoading(false);
      }
    },
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    let cancelled = false;
    fetchData(cancelled, firstParams);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [fetchData]);

  return {
    loading,
    data,
    error,
    fetchData,
  };
};

export default useApi;
