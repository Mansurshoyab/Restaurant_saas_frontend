const axios = require('axios');
const formData = new FormData();
formData.append('test', '123');

const client = axios.create({ headers: { 'Content-Type': 'application/json' } });

client.interceptors.request.use(config => {
  console.log('Headers before send:', config.headers);
  return config;
});

client.post('http://127.0.0.1:9999', formData, {
  headers: { 'Content-Type': undefined }
}).catch(() => {});
