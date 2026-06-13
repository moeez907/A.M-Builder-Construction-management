import https from 'https';

https.get('https://ais-pre-lesykavronnecrg4xnwu5w-50443192976.asia-east1.run.app/api/health-db', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
}).on('error', (err) => console.error("Error:", err.message));

https.get('https://ais-pre-lesykavronnecrg4xnwu5w-50443192976.asia-east1.run.app/api/auth/login', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Login Status:', res.statusCode, 'Body:', data));
}).on('error', (err) => console.error("Error:", err.message));
