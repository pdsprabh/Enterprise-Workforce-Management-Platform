const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/workforce').then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('candidates').updateMany(
    { resumeUrl: 'uploaded' },
    { $set: { resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } }
  );
  console.log('Modified candidates:', result.modifiedCount);
  process.exit(0);
});
