const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '69be93de1a48428c55f85adb' }, 'e3e2160ee7a687af7c08e0d4408ea3b56ef3eba604a34687fa50d424c07a1356', { expiresIn: '1h' });

axios.get('http://localhost:8080/api/social-agent/workspaces/all', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => {
  console.log(JSON.stringify(res.data.workspaces.map(w => ({ id: w._id, name: w.workspaceName, count: w.calendarEntryCount })), null, 2));
}).catch(err => {
  console.error(err.response ? err.response.data : err.message);
});
