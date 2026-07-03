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

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(validUser);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.userId).toBeDefined();
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
            expect(res.statusCode).toEqual(401); // 401 for invalid credentials
        }

        // 6th attempt should return 403 locked
        const resLocked = await request(app)
            .post('/api/auth/login')
            .send({ email: validUser.email, password: 'WrongPassword1!' });
        
        expect(resLocked.statusCode).toEqual(403);
        expect(resLocked.body.message).toMatch(/Account locked/);
    });
});
