const fs = require('fs');
fetch('http://localhost:3000/api/documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-email': 'admin@ambuilders.com',
    'x-user-role': 'Admin'
  },
  body: JSON.stringify({
    id: 'DOC-9999',
    projectId: 'AMB-2026-001',
    title: 'Huge DB test',
    type: 'Layout',
    fileName: 'map.jpg',
    fileSize: '5 MB',
    uploadDate: '2026-06-12',
    uploadedBy: 'Admin',
    description: 'Testing',
    visibility: 'Internal',
    fileUrl: 'data:image/jpeg;base64,' + 'A'.repeat(50000)
  })
}).then(r => r.json()).then(console.log).catch(console.error);
