const axios = require('axios');
(async () => {
  try {
    const fd = new require('form-data')();
    fd.append('prompt', 'test');
    await axios.post('http://localhost:8080/api/edit-image', fd, { headers: fd.getHeaders() });
  } catch (err) {
    console.log(err.message, err.response?.status);
  }
})();