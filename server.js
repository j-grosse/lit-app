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

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send an array every 100ms
  const sendData = () => {
    const data = generateFluctuatingArray(averageValue, fluctuationRange);
    ws.send(JSON.stringify(data));
  };

  const averageValue = 0.5; // Average value
  const fluctuationRange = 0.3; // Range of fluctuation

  // Function to generate an array with random values between 0 and 1.00
  const generateFluctuatingArray = (averageValue, fluctuationRange) => {
    const fluctuatingArray = [];

    const randomFluctuation =
      Math.random() * fluctuationRange * 2 - fluctuationRange; // Generate random fluctuation within the specified range
    const value = parseFloat((averageValue + randomFluctuation).toFixed(2)); // Add random fluctuation average value
    fluctuatingArray.push(value);
    // fluctuatingArray.push(value * 2); //PP

    return fluctuatingArray;
  };

  const interval = setInterval(sendData, 1000);

  ws.on('message', (message) => {
    console.log('Received message:', message + '\n');
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
