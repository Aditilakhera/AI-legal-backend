const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const db = mongoose.connection.db;
  const workspaces = await db.collection('socialagentworkspaces').find().toArray();
  for (let ws of workspaces) {
    console.log(`WS ${ws._id}: isPersonalProfile=${ws.isPersonalProfile}, name=${ws.workspaceName}`);
  }
  process.exit(0);
});
