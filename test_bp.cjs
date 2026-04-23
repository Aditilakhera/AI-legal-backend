const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const workspaces = await mongoose.connection.collection('socialagentworkspaces').aggregate([
    { $lookup: { from: 'brandprofiles', localField: '_id', foreignField: 'workspaceId', as: 'bp' } },
    { $addFields: { hasBrand: { $gt: [{ $size: '$bp' }, 0] } } },
    { $project: { _id: 1, hasBrand: 1, brandName: { $arrayElemAt: ['$bp.companyName', 0] } } }
  ]).toArray();
  console.log(JSON.stringify(workspaces, null, 2));
  process.exit(0);
});
