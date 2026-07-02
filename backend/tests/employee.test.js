const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');
const Department = require('../src/models/Department');

describe('Employee Endpoints', () => {
    let token;
    let userId;
    let deptId;

    beforeEach(async () => {
        const hrUser = await User.create({
            name: 'HR User',
            email: 'hr@example.com',
            password: 'Password123!',
            role: 'HR Manager'
        });
        userId = hrUser._id;
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hr@example.com', password: 'Password123!' });
            
        token = res.body.token;

        const dept = await Department.create({ departmentName: 'Engineering', departmentCode: 'ENG' });
        deptId = dept._id;
    });

    it('should create an employee and auto-generate employeeId', async () => {
        const res = await request(app)
            .post('/api/employees')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user: userId,
                name: 'New Employee',
                email: 'emp@example.com',
                joiningDate: new Date().toISOString()
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.employeeId).toMatch(/^EMP\d{4}$/);
    });

    it('should fail if joining date is in the future', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2); // 2 days in future
        
        const res = await request(app)
            .post('/api/employees')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user: userId,
                name: 'Future Employee',
                email: 'future@example.com',
                joiningDate: futureDate.toISOString()
            });
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/Joining Date cannot exceed current date/);
    });

    it('should prevent archiving department if active employee exists', async () => {
        await Employee.create({
            user: userId,
            name: 'Active Emp',
            email: 'active@example.com',
            joiningDate: new Date(),
            department: deptId,
            status: 'Active'
        });

        const res = await request(app)
            .delete(`/api/departments/${deptId}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/Cannot archive department with active employees/);
    });
});
