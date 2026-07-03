const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Department = require('../src/models/Department');

describe('Department Endpoints', () => {
    let token;

    beforeEach(async () => {
        // Create an HR Manager to get token
        const hrUser = await User.create({
            name: 'HR User',
            email: 'hr@example.com',
            password: 'Password123!',
            role: 'HR Manager'
        });
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hr@example.com', password: 'Password123!' });
            
        token = res.body.token;
    });

    it('should create a new department', async () => {
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                departmentName: 'Engineering',
                departmentCode: 'ENG'
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.departmentCode).toEqual('ENG');
    });

    it('should not allow duplicate department code', async () => {
        await Department.create({ departmentName: 'Engineering', departmentCode: 'ENG' });
        
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                departmentName: 'Another Eng',
                departmentCode: 'ENG'
            });
            
        expect(res.statusCode).toEqual(400); // Unique constraint fails
    });

    it('should archive department if no employees', async () => {
        const dept = await Department.create({ departmentName: 'HR', departmentCode: 'HR01' });
        
        const res = await request(app)
            .delete(`/api/departments/${dept._id}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('Archived');
    });
});
