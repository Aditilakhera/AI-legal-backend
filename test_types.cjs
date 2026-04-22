const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const db = mongoose.connection.db;
  const entries = await db.collection('calendarentries').find().limit(10).toArray();
  const types = entries.map(e => ({ id: e._id, wsId: e.workspaceId, type: typeof e.workspaceId, isObjectId: e.workspaceId instanceof mongoose.Types.ObjectId }));
  console.log(JSON.stringify(types, null, 2));
  process.exit(0);
});
