import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = 'e3e2160ee7a687af7c08e0d4408ea3b56ef3eba604a34687fa50d424c07a1356';

const token = jwt.sign({ id: 'demo-test' }, JWT_SECRET, { expiresIn: '1d' });

axios.post('https://aisa24.com/api/payment/apple-pay/validate-merchant', {
  validationURL: 'https://apple.com'
}, {
  headers: {
    Authorization: 'Bearer ' + token
  }
}).then(res => {
  console.log('STATUS:', res.status);
  console.log('DATA:', JSON.stringify(res.data, null, 2));
}).catch(err => {
  console.log('ERROR STATUS:', err.response ? err.response.status : 'no response');
  console.log('ERROR DATA:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
});
