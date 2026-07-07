import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { DEPARTMENTS, DESIGNATIONS } from '../../utils/constants';
import { register } from '../../api/authApi';
import { createEmployee } from '../../api/employeeApi';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    department: DEPARTMENTS[0],
    designation: DESIGNATIONS[0],
    joinDate: '',
    salary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create a user account for the employee
      const userRes = await register({
        name: formData.name,
        email: formData.email,
        password: 'Password@123', // Default temporary password
        role: 'Employee'
      });
      
      const newUserId = userRes.user.id;

      // 2. Create the employee record linked to the user
      await createEmployee({
        user: newUserId,
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        dob: formData.dob || undefined,
        address: formData.address || undefined,
        department: formData.department,
        designation: formData.designation,
        joiningDate: formData.joinDate,
        salaryGrade: formData.salary,
      });

      addToast({ type: 'success', message: 'Employee added successfully' });
      navigate('/employees');
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to add employee' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/employees')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '8px' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, marginBottom: '4px' }}>Add New Employee</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Enter details to onboard a new employee
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>Personal Information</CardHeader>
          <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <div style={{ gridColumn: 'span 2' }}>
              <Input
                label="Home Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </div>
          </CardBody>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>Employment Details</CardHeader>
          <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-group__label">Department <span className="input-group__required">*</span></label>
              <select 
                className="input-group__input"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-group__label">Designation <span className="input-group__required">*</span></label>
              <select 
                className="input-group__input"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              >
                {DESIGNATIONS.map((desig) => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>

            <Input
              label="Joining Date"
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Annual Salary (Base)"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 80000"
              required
            />
          </CardBody>
          <CardFooter>
            <Button variant="ghost" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Employee
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
