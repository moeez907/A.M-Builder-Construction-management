import http from 'http';

const payload = JSON.stringify([
  {
    "projectId": "AMB-2026-001",
    "title": "Test Doc",
    "type": "Test",
    "fileName": "test.pdf",
    "fileSize": "1MB",
    "uploadDate": "2026-06-12",
    "uploadedBy": "System",
    "description": "Test",
    "visibility": "Internal only",
    "fileUrl": "test"
  }
]);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/documents',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

req.on('error', e => console.error('Error:', e));
req.write(payload);
req.end();
