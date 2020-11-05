import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';

import useApi from '../hooks/useApi';
import useSocket from '../hooks/useSocket';

import { UserContext } from './UserContext';

import Spinner from '../components/ui/Spinner';

export const TimestampContext = createContext();

export const TimestampProvider = ({ children }) => {
  const { apiCall, user } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [timestampDefinitions, setTimestampDefinitions] = useState([]);

  const { loading, data, error, fetchData } = useApi('get', 'ongoing-port-calls');

  const reFetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useSocket('portcalls-changed', reFetch);
  // Pinned status has changed
  useSocket(`portcalls-changed-${user.id}`, reFetch);

  useEffect(() => {
    // lets make sure this screen is updated regularly
    const timer = setInterval(reFetch, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [reFetch]);

  useEffect(() => {
    async function fetchDefinitions() {
      if (user.permissions.includes('add_manual_timestamp')) {
        const { data } = await apiCall('get', 'timestamp-definitions');
        setTimestampDefinitions(data);
      }
    }
    fetchDefinitions();
    // eslint-disable-next-line
  }, []);

  const { portcalls } = data || { portcalls: [] };
  const pinnedVessels =
    data && data.pinned_vessels && data.pinned_vessels && Array.isArray(data.pinned_vessels) ? data.pinned_vessels : [];

  if (isFirstLoad && loading) {
    setIsFirstLoad(false);
    return <Spinner loading={loading} size="large" />;
  }

  let timestamps = error ? [] : portcalls;

  pinnedVessels.forEach(imo => {
    const index = timestamps.findIndex(({ ship }) => ship && ship.imo === imo);
    index !== -1 && timestamps.unshift(timestamps.splice(index, 1)[0]);
  });

  timestamps.sort((a, b) => {
    if (pinnedVessels.indexOf(a.ship.imo) === -1 || pinnedVessels.indexOf(b.ship.imo) === -1) {
      return 0;
    }
    return pinnedVessels.indexOf(a.ship.imo) - pinnedVessels.indexOf(b.ship.imo);
  });

  if (search !== '') {
    const searchResult = timestamps.filter(entry => {
      return Object.values(entry.ship).find(value => {
        return (
          value &&
          String(value)
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      });
    });
    timestamps = searchResult.sort((a, b) => a.ship.vessel_name > b.ship.vessel_name);
  }

  // resolve last "good" spot where we can split port call in timeline
  let found = {};
  timestamps.forEach(({ portcalls }, portcallIndex) => {
    let previousActualIndexes = [-1, -1];
    let lastFoundIndexes = [-1, -1];
    portcalls[0].events.forEach((event, eventIndex) => {
      event.timestamps.forEach((timestamp, timestampIndex) => {
        if (lastFoundIndexes[0] < 0 && timestamp.time) {
          lastFoundIndexes = [eventIndex, timestampIndex];
        }
        if (previousActualIndexes[0] > -1 && timestamp.time) {
          lastFoundIndexes = [eventIndex, timestampIndex];
          previousActualIndexes = [-1, -1];
        }

        if (timestamp.time_type === 'Actual' && timestamp.time) {
          previousActualIndexes = [eventIndex, timestampIndex];
          lastFoundIndexes = [eventIndex, timestampIndex];
        } else {
          previousActualIndexes = [-1, -1];
        }
        found[portcallIndex] = lastFoundIndexes;
      });
    });
  });

  const past = timestamps.map(({ ship, portcalls }, portcallIndex) => ({
    ...ship,
    events: portcalls[0].events
      .map((event, eventIndex) => {
        return {
          ...event,
          timestamps:
            found[portcallIndex][0] === eventIndex
              ? event.timestamps.filter((timestamp, timestampIndex) => {
                  return timestampIndex <= found[portcallIndex][1];
                })
              : event.timestamps,
        };
      })
      .filter((event, eventIndex) => {
        return eventIndex <= found[portcallIndex][0];
      }),
  }));

  const future = timestamps.map(({ ship, portcalls }, portcallIndex) => ({
    ...ship,
    events: portcalls[0].events
      .map((event, eventIndex) => {
        return {
          ...event,
          timestamps:
            found[portcallIndex][0] === eventIndex
              ? event.timestamps.filter((timestamp, timestampIndex) => {
                  return timestampIndex > found[portcallIndex][1];
                })
              : event.timestamps,
        };
      })
      .filter((event, eventIndex) => {
        return eventIndex >= found[portcallIndex][0];
      }),
  }));

  return (
    <TimestampContext.Provider
      value={{
        timestamps: timestamps,
        pastTimestamps: past,
        futureTimestamps: future,
        totalVessels: portcalls ? portcalls.length : 0,
        search: search,
        setSearch: setSearch,
        timestampDefinitions: timestampDefinitions,
        pinnedVessels: pinnedVessels,
      }}
    >
      {children}
    </TimestampContext.Provider>
  );
};
