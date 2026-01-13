const http = require('http');

// First login to get token
const loginData = JSON.stringify({
  email: 'admin@grandcity.pk',
  password: 'adm123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('Testing API...\n');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Login response:', data);
    const result = JSON.parse(data);
    
    if (result.token) {
      console.log('\n✓ Login successful, testing visits API...\n');
      
      // Now test visits endpoint
      const visitsOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/visits',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`
        }
      };
      
      const visitsReq = http.request(visitsOptions, (res) => {
        let visitsData = '';
        res.on('data', chunk => visitsData += chunk);
        res.on('end', () => {
          console.log('Visits response status:', res.statusCode);
          console.log('Visits response:', visitsData);
        });
      });
      
      visitsReq.on('error', (e) => console.error('Visits request error:', e));
      visitsReq.end();
    }
  });
});

loginReq.on('error', (e) => console.error('Login request error:', e));
loginReq.write(loginData);
loginReq.end();
