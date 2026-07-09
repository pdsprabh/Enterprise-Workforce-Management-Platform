const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/enterprise_workforce').then(() => {
    mongoose.connection.db.collection('documents').find({
        $and: [
            { $or: [{ owner: { $exists: false } }, { owner: null }] },
            { $or: [{ allowedRoles: { $exists: false } }, { allowedRoles: { $size: 0 } }, { allowedRoles: 'IT Administrator' }] }
        ]
    }).toArray().then(docs => {
        console.log('MATCHED:', docs.length);
        process.exit(0);
    });
});
