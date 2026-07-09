const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
    
    const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'HR Manager'
    };

    // Admin used to call the now-protected /register endpoint
    const adminUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'Super Admin'
    };

    it('should register a new user when called by an admin', async () => {
        // Create a Super Admin directly in DB (bypasses the guard)
        await User.create(adminUser);

        // Log in as Super Admin to get a token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: adminUser.email, password: adminUser.password });
        const adminToken = loginRes.body.token;

        // Now register a new user using the admin token
        const res = await request(app)
            .post('/api/auth/register')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validUser);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.user.id).toBeDefined();
    });

    it('should reject register without a token (401)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(validUser);
        
        expect(res.statusCode).toEqual(401);
    });

    it('should reject register from a non-admin role (403)', async () => {
        // Create and log in as a plain Employee
        await User.create({ name: 'Emp', email: 'emp@example.com', password: 'Emp123456!', role: 'Employee' });
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'emp@example.com', password: 'Emp123456!' });
        const empToken = loginRes.body.token;

        const res = await request(app)
            .post('/api/auth/register')
            .set('Authorization', `Bearer ${empToken}`)
            .send(validUser);
        
        expect(res.statusCode).toEqual(403);
    });

    it('should login an existing user', async () => {
        await User.create(validUser);
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: validUser.email, password: validUser.password });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.token).toBeDefined();
    });

    it('should lock account after 5 failed login attempts', async () => {
        await User.create(validUser);
        
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: validUser.email, password: 'WrongPassword1!' });
            expect(res.statusCode).toEqual(401);
        }

        // 6th attempt should return 403 locked
        const resLocked = await request(app)
            .post('/api/auth/login')
            .send({ email: validUser.email, password: 'WrongPassword1!' });
        
        expect(resLocked.statusCode).toEqual(403);
        expect(resLocked.body.message).toMatch(/Account locked/);
    });
});
