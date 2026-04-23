const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const workspaces = await mongoose.connection.collection('socialagentworkspaces').aggregate([
    { $lookup: { from: 'calendarentries', localField: '_id', foreignField: 'workspaceId', as: 'calendarEntries' } },
    { $addFields: { count: { $size: '$calendarEntries' } } },
    { $project: { _id: 1, workspaceName: 1, count: 1 } }
  ]).toArray();
  console.log(JSON.stringify(workspaces, null, 2));
  process.exit(0);
});