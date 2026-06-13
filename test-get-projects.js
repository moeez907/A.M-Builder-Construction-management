fetch('http://localhost:3000/api/projects', {
  method: 'GET',
  headers: {
    'x-user-email': 'admin@ambuilders.com',
    'x-user-role': 'Admin'
  }
}).then(r => r.json()).then(console.log).catch(console.error);
