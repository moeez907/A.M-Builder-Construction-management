const http = require('http');
const payload = JSON.stringify({
  "projectId": "AMB-2026-001",
  "title": "Test Large Base64",
  "type": "Agreement",
  "fileName": "test.pdf",
  "fileSize": "1MB",
  "uploadDate": "2026-06-12",
  "uploadedBy": "System",
  "description": "Test",
  "visibility": "Internal only",
  "fileUrl": "data:application/pdf;base64,JVBERi0xLjQKJdXi+..."
});
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/documents',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-email': 'abdulmoeeztariq716@gmail.com',
    'Content-Length': Buffer.byteLength(payload)
  }
};
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.write(payload);
req.end();
