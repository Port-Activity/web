import { useEffect } from 'react';
import socket from '../utils/socket';

const useSocket = (channel, callback) => {
  useEffect(() => {
    const setSource = () => {
      (async () => {
        // Set up a loop to handle remote transmitted events.
        // eslint-disable-next-line
        for await (let data of socket.subscribe(channel)) {
          callback(data);
        }
      })();
    };

    const unsetSource = () => {
      socket.unsubscribe(channel);
    };

    setSource();
    return () => unsetSource();
  }, [channel, callback]);

  return {};
};

export default useSocket;
