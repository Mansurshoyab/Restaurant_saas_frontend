const axios = require('axios');
const formData = new FormData();
formData.append('test', '123');

const client = axios.create({ headers: { 'Content-Type': 'application/json' } });

client.post('http://127.0.0.1:9999', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).catch(err => {
  // Let's actually inspect the raw HTTP request emitted.
  console.log("Error handled");
});

// Start dummy server to see raw request
const http = require('http');
const server = http.createServer((req, res) => {
  console.log('Received headers:', req.headers['content-type']);
  res.end('ok');
});
server.listen(9999, () => {
  client.post('http://127.0.0.1:9999', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(() => server.close());
});
