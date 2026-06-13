import http from 'http';

setTimeout(() => {
  http.get('http://localhost:3000/api/projects', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode, 'Body:', data.substring(0, 100));
        process.exit(0);
    });
  }).on('error', (err) => {
      console.error("Error:", err.message);
      process.exit(1);
  });
}, 2000);
