import http from 'http';
import {WebSocketServer} from 'ws';
const port = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebSocket Test</title>
    </head>
    <body>
      <h1>WebSocket Test</h1>
      <p>Open your browser's developer tools to see the WebSocket messages.</p>
      <script>
        const socket = new WebSocket('ws://localhost:' + ${port});

        socket.onopen = () => {
          console.log('WebSocket test connection established');
        };

        socket.onmessage = (event) => {
          console.log('Received message:', event.data);
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      </script>
    </body>
    </html>
  `);
});

const wss = new WebSocketServer({server});
const rawValue = 1.00; // fictional voltage input value from hardware
let scaledValue = 1.00; // scaled value for gauge display
let fluctuationRange = scaledValue / 20; // range of fluctuation

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // send websocket data array every 100ms
  const sendData = () => {
    const data = generateFluctuatingArray(scaledValue, fluctuationRange);
    ws.send(JSON.stringify(data));
  };

  const interval = setInterval(sendData, 100);

  // generate array with fluctuating values
  const generateFluctuatingArray = (scaledValue, fluctuationRange) => {
    const fluctuatingArray = [];
    // generate random fluctuation and add to scaledValue
    const randomFluctuation =
      Math.random() * fluctuationRange * 2 - fluctuationRange;
    const av = parseFloat(scaledValue + randomFluctuation);

    // calculate the other values relative to av
    const absAv = Math.abs(av);
    const p = Math.pow(av, 2);
    const pp = Math.abs(av) * 2;
    const rms = Math.sqrt(Math.pow(av, 2) / 2);

    // create the array with the values to display
    fluctuatingArray.push(av, absAv, p, pp, rms);

    return fluctuatingArray;
  };

  // calculates the new scaledValue when the user changes the voltmeter range (maxVal)
  ws.on('message', (message) => {
    console.log('Message sent from client to server: ', message + '\n');
    try {
      let data = {};
      if (message != 'initialData') {
        data = JSON.parse(message);
      }
      if (data.hasOwnProperty('option')) {
        if (typeof data.option === 'number') {
          const maxValue = Number(data.option);
          console.log('range changed by user to: ', maxValue);
          console.log('old scaledValue: ', scaledValue);
          // calculate the new scaledValue from maxValue and rawValue
          scaledValue = Number((rawValue / maxValue).toFixed(2));
          // update fluctuationRange
          fluctuationRange = Number((scaledValue / 20).toFixed(2));
        }
        console.log('new scaledValue:', scaledValue);
      }
    } catch (error) {
      console.error('Error parsing JSON message sent from client:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});
