const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const Document = require('./src/models/Document');
const User = require('./src/models/User');

const mockDocs = [
  {
    documentName: 'Acceptable Use Policy (AUP)',
    docType: 'Policy',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Using a safe standard dummy PDF
    allowedRoles: ['Employee', 'HR Manager', 'IT Administrator', 'Organization Admin'],
  },
  {
    documentName: 'Bring Your Own Device (BYOD) Policy',
    docType: 'Policy',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowedRoles: ['Employee', 'HR Manager', 'IT Administrator', 'Organization Admin'],
  },
  {
    documentName: 'Information Security Guidelines 2026',
    docType: 'Policy',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowedRoles: ['Employee', 'HR Manager', 'IT Administrator', 'Organization Admin'],
  },
  {
    documentName: 'IT Admin Incident Response Plan',
    docType: 'Policy',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    // Restricted to IT and Admins
    allowedRoles: ['IT Administrator', 'Organization Admin'],
  }
];

async function seedDocuments() {
  try {
    // connect to local port mapped to the mongo container
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/enterprise_workforce';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    // Find the IT Admin user to set as the uploader
    const itAdmin = await User.findOne({ role: 'IT Administrator' });
    const uploadedById = itAdmin ? itAdmin._id : null;

    for (let doc of mockDocs) {
      doc.uploadedBy = uploadedById;
      await Document.create(doc);
    }
    
    console.log('Successfully seeded mock IT policy documents!');
    process.exit();
  } catch (err) {
    console.error('Error seeding documents:', err);
    process.exit(1);
  }
}

seedDocuments();
