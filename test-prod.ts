import { spawn } from 'child_process';
import http from 'http';

const server = spawn('node', ['dist/server.cjs'], {
  env: { ...process.env, PORT: '3001', NODE_ENV: 'production' }
});

server.stdout.on('data', (data) => console.log('SERVER OUT:', data.toString()));
server.stderr.on('data', (data) => console.error('SERVER ERR:', data.toString()));

setTimeout(() => {
  http.get('http://localhost:3001/api/projects', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Got Projects Status:', res.statusCode, 'Body:', data.substring(0, 100));
        server.kill();
        process.exit(0);
    });
  }).on('error', (err) => {
      console.error("HTTP Error:", err.message);
      server.kill();
      process.exit(1);
  });
}, 3000);
