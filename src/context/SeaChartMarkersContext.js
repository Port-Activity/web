import React, { createContext, useCallback } from 'react';
import useApi from '../hooks/useApi';
import useSocket from '../hooks/useSocket';
import { message } from 'antd';

export const SeaChartMarkersContext = createContext();

export const SeaChartMarkersProvider = ({ children }) => {
  const { loading, data, error, fetchData } = useApi('get', 'sea-chart/markers', {});

  if (error) {
    message.error(error, 4);
  }

  const getMarkers = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const seaChartMarkersChanged = useCallback(
    data => {
      if (data) {
        getMarkers();
      }
    },
    [getMarkers]
  );

  useSocket('sea-chart-markers-changed', seaChartMarkersChanged);

  const markers = error || !data ? undefined : data;

  return (
    <SeaChartMarkersContext.Provider
      value={{
        getMarkers: getMarkers,
        markers: markers,
        loading: loading,
      }}
    >
      {children}
    </SeaChartMarkersContext.Provider>
  );
};
