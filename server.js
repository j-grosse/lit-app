import http from 'http';
import {WebSocketServer} from 'ws';

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
        const socket = new WebSocket('ws://localhost:3000');

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
const rawValue = 1.0; // Voltage input value
let scaledValue = rawValue; // scaled average value to display
let fluctuationRange = scaledValue / 20; // Range of fluctuation

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send data array every 100ms
  const sendData = () => {
    const data = generateFluctuatingArray(scaledValue, fluctuationRange);
    ws.send(JSON.stringify(data));
  };

  // Function to generate an array with fluctuating values
  const generateFluctuatingArray = (scaledValue, fluctuationRange) => {
    const fluctuatingArray = [];
    // Generate random fluctuation and add to scaledValue
    const randomFluctuation =
      Math.random() * fluctuationRange * 2 - fluctuationRange;
    const av = parseFloat((scaledValue + randomFluctuation).toFixed(2));

    // calculate the other values relative to av
    const absAv = Math.abs(av);
    const p = Math.pow(av, 2);
    const pp = Math.abs(av) * 2;
    const rms = Math.sqrt(Math.pow(av, 2) / 2);

    // create the array with the values to display
    fluctuatingArray.push(av);
    fluctuatingArray.push(absAv);
    fluctuatingArray.push(p);
    fluctuatingArray.push(pp);
    fluctuatingArray.push(rms);

    return fluctuatingArray;
  };

  const interval = setInterval(sendData, 1000);
  // const interval = setInterval(sendData, 100);

  // when the user changes the range (maxVal) the server calculates the new scaledValue
  ws.on('message', (message) => {
    console.log('Message sent from client to server: ', message + '\n');
    try {
      let options = {};
      if (message != 'initialData') {
        options = JSON.parse(message);
      }
      if (options.hasOwnProperty('maxValue')) {
        const maxValue = parseFloat(options.maxValue);
        console.log('range changed by user to: ', maxValue);
        console.log('old scaledValue: ', scaledValue);
        // calculate the new scaledValue from maxValue and rawValue
        scaledValue = rawValue / parseFloat(options.maxValue);
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

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
