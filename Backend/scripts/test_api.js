const http = require('http');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODcxOTcyZGYxZDU5ZTczMjNmY2MyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NzU5MDAyOSwiZXhwIjoxNzg3NTkzNjI5fQ.-ZHHa4pwJKM6DCTz_UOx6WibcP8Z7KJWG-c7hBwCEmo";

const testEndpoint = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`\n=== ${path} ===`);
        console.log('Status:', res.statusCode);
        try {
          const parsed = JSON.parse(data);
          console.log('success:', parsed.success);
          if (parsed.hosts) console.log('hosts count:', parsed.hosts.length);
          if (parsed.tenants) console.log('tenants count:', parsed.tenants.length);
          if (parsed.properties) console.log('properties count:', parsed.properties.length);
          if (!parsed.success) console.log('message:', parsed.message);
        } catch (e) {
          console.log('Raw response:', data.substring(0, 300));
        }
        resolve();
      });
    });
    req.on('error', reject);
    req.end();
  });
};

(async () => {
  await testEndpoint('/api/admin/owners');
  await testEndpoint('/api/admin/tenants');
  await testEndpoint('/api/admin/properties');
  await testEndpoint('/api/admin/dashboard/stats');
})().catch(console.error);
