const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'kvzawanz',
  api_key: '393968756417354',
  api_secret: 'EImhqH6A2Xte0RveFU5wzL4HCDA'
});

async function run() {
  const dummyBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\n0000000296 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n389\n%%EOF');
  
  // Test raw
  try {
    const rawRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'raw', public_id: 'test-raw.pdf' }, (err, res) => err ? reject(err) : resolve(res));
      stream.end(dummyBuffer);
    });
    console.log('Raw:', rawRes.secure_url);
  } catch(e) { console.error(e); }

  // Test image
  try {
    const imageRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', public_id: 'test-img.pdf' }, (err, res) => err ? reject(err) : resolve(res));
      stream.end(dummyBuffer);
    });
    console.log('Image:', imageRes.secure_url);
  } catch(e) { console.error(e); }
  
  // Test auto
  try {
    const autoRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', public_id: 'test-auto.pdf' }, (err, res) => err ? reject(err) : resolve(res));
      stream.end(dummyBuffer);
    });
    console.log('Auto:', autoRes.secure_url);
  } catch(e) { console.error(e); }
}

run();
