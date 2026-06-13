import http from 'http';
fetch('http://localhost:3000/api/documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-email': 'admin@ambuilders.com',
    'x-user-role': 'Admin'
  },
  body: JSON.stringify({
    id: 'DOC-1002',
    projectId: 'AMB-2026-001',
    title: 'New Upload',
    type: 'Layout',
    fileName: 'map.jpg',
    fileSize: '5 MB',
    uploadDate: '2026-06-12',
    uploadedBy: 'Admin',
    description: 'Testing',
    visibility: 'Internal',
    fileUrl: 'data:image/jpeg;base64,A'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
