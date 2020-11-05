import React, { createContext, useCallback } from 'react';
import useApi from '../hooks/useApi';
import useSocket from '../hooks/useSocket';
import { message } from 'antd';

export const SeaChartVesselsContext = createContext();

export const SeaChartVesselsProvider = ({ children }) => {
  const { loading, data, error, fetchData } = useApi('get', 'sea-chart/vessels', {});

  if (error) {
    message.error(error, 4);
  }

  const getVessels = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const seaChartVesselsChanged = useCallback(
    data => {
      if (data) {
        getVessels();
      }
    },
    [getVessels]
  );

  useSocket('sea-chart-vessels-changed', seaChartVesselsChanged);

  const vessels = error || !data ? undefined : data;

  return (
    <SeaChartVesselsContext.Provider
      value={{
        getVessels: getVessels,
        vessels: vessels,
        loading: loading,
      }}
    >
      {children}
    </SeaChartVesselsContext.Provider>
  );
};
