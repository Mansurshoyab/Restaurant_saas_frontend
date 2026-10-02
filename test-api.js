import axios from 'axios';
async function run() {
  try {
    const res = await axios.post('http://localhost:4000/api/v1/expenses', {
      category: 'OTHER',
      amount: 10,
      method: 'CASH',
      description: ''
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
