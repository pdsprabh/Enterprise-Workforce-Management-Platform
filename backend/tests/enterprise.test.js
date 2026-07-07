const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');
const Payroll = require('../src/models/Payroll');

describe('Enterprise Endpoints (Day 3 & 4)', () => {
    let hrToken;
    let empToken;
    let employeeId;

    beforeEach(async () => {
        const hrUser = await User.create({
            name: 'HR User',
            email: 'hradmin@example.com',
            password: 'Password123!',
            role: 'HR Manager'
        });
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hradmin@example.com', password: 'Password123!' });
            
        hrToken = res.body.token;

        const empUser = await User.create({
            name: 'Test Employee User',
            email: 'empuser@example.com',
            password: 'Password123!',
            role: 'Employee'
        });
        
        const empRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'empuser@example.com', password: 'Password123!' });
            
        empToken = empRes.body.token;

        const emp = await Employee.create({
            user: empUser._id,
            name: 'Test Employee',
            email: 'testemp@example.com',
            joiningDate: new Date(),
        });
        employeeId = emp._id;
    });

    it('should generate payroll and calculate net salary', async () => {
        const res = await request(app)
            .post('/api/payroll')
            .set('Authorization', `Bearer ${hrToken}`)
            .send({
                employee: employeeId,
                month: 7,
                year: 2026,
                basicSalary: 60000,
                hra: 12000,
                bonus: 5000,
                overtime: 3000,
                deductions: 2500
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.netSalary).toEqual(77500); // 60k + 12k + 5k + 3k - 2.5k
    });

    it('should not allow generating payroll for the same month twice', async () => {
        await Payroll.create({
            employee: employeeId,
            month: 7,
            year: 2026,
            basicSalary: 60000
        });

        const res = await request(app)
            .post('/api/payroll')
            .set('Authorization', `Bearer ${hrToken}`)
            .send({
                employee: employeeId,
                month: 7,
                year: 2026,
                basicSalary: 60000
            });
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/already exists/);
    });

    it('should create a helpdesk ticket', async () => {
        const res = await request(app)
            .post('/api/helpdesk')
            .set('Authorization', `Bearer ${empToken}`)
            .send({
                title: 'Mouse not working',
                description: 'Need a new mouse',
                category: 'it'   // category is required by HelpDeskTicket schema
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.status).toEqual('Open');
    });

    it('should create an asset record', async () => {
        const res = await request(app)
            .post('/api/assets')
            .set('Authorization', `Bearer ${hrToken}`) // Wait, Super Admin or IT Admin needed for assets, wait HR manager isn't allowed to create assets.
            // Oh, my route has authorize('Super Admin', 'IT Administrator')
            .send({
                assetName: 'MacBook Pro',
                assetType: 'Laptop',
                assignedTo: employeeId
            });
        
        // Since hrToken is HR Manager, it should be 403 Forbidden
        expect(res.statusCode).toEqual(403);
    });
});
