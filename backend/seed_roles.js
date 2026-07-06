const http = require('http');

const roles = ['Super Admin', 'Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'];

const registerUser = (role) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: `Test ${role}`,
      email: `${role.replace(' ', '').toLowerCase()}@test.com`,
      password: 'Password123!',
      role: role,
      mobile: '1234567890'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
};

(async () => {
  for (const role of roles) {
    try {
      console.log(`Registering ${role}...`);
      const res = await registerUser(role);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
})();
