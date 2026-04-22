const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const db = mongoose.connection.db;
  const workspaces = await db.collection('socialagentworkspaces').find().toArray();
  for (let ws of workspaces) {
    const count = await db.collection('calendarentries').countDocuments({ workspaceId: ws._id });
    const countStr = await db.collection('calendarentries').countDocuments({ workspaceId: ws._id.toString() });
    console.log(`WS ${ws._id}: ObjIdCount=${count}, StrCount=${countStr}`);
  }
  process.exit(0);
});
