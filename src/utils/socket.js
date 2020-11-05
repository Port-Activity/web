import socketClusterClient from 'socketcluster-client';
// TODO: Add authentication
//import { API_URL } from '../utils/constants';
// const sessionId = localStorage.getItem('sessionId');
// const source = new EventSource(`${API_URL}/sse`, { headers: { Authorization: `Bearer ${sessionId}` } });

let options = {
  autoReconnectOptions: {
    initialDelay: 1000, //milliseconds
    randomness: 1000, //milliseconds
    multiplier: 1.5, //decimal
    maxDelay: 6000, //milliseconds
  },
};

if (process.env.REACT_APP_SOCKETCLUSTER_HOST) {
  options.hostname = process.env.REACT_APP_SOCKETCLUSTER_HOST;
}
if (process.env.REACT_APP_SOCKETCLUSTER_PORT) {
  options.port = process.env.REACT_APP_SOCKETCLUSTER_PORT;
}

// Initiate the connection to the server
const socket = socketClusterClient.create(options);

(async () => {
  (async () => {
    // eslint-disable-next-line
      for await (let { error } of socket.listener('error')) {
      console.error('Error with socket', error);
    }
  })();
  (async () => {
    // eslint-disable-next-line
      for await (let event of socket.listener('connect')) {
      console.log('Socket is connected');
    }
  })();
})();

export default socket;
