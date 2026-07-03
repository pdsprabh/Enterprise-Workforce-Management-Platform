import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { getEmployeeById } from '../../api/employeeApi';
import { formatDate, formatCurrency } from '../../utils/formatters';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await getEmployeeById(id);
        if (response.success) {
          setEmployee(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Loading employee profile...</h2>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Employee not found</h2>
        <Button onClick={() => navigate('/employees')} style={{ marginTop: '16px' }}>
          Back to List
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'employment', label: 'Employment' },
    { id: 'documents', label: 'Documents' },
    { id: 'attendance', label: 'Attendance' },
  ];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/employees')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '8px' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Employee Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Profile Sidebar */}
        <div style={{ gridColumn: 'span 4' }}>
          <Card>
            <CardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar name={employee.name} size="xl" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>{employee.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>{employee.designation}</p>
              
              <Badge color={employee.status === 'Active' ? 'success' : 'warning'} style={{ marginBottom: '24px' }}>
                {employee.status}
              </Badge>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Email</label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Phone</label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.mobile || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Department</label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.department?.departmentName || employee.department || 'Not Assigned'}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Profile Content */}
        <div style={{ gridColumn: 'span 8' }}>
          <Card className="h-full">
            <CardHeader style={{ padding: 0 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', width: '100%' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '16px 24px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                      color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody>
              {activeTab === 'personal' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Full Name</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.name}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date of Birth</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.dob ? formatDate(employee.dob) : 'N/A'}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Address</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.address || 'N/A'}</p>
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Employee ID</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.employeeId || 'N/A'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date of Joining</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.joiningDate ? formatDate(employee.joiningDate) : 'N/A'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Base Salary Grade</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.salaryGrade || 'N/A'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Reporting Manager</label>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{employee.manager?.name || 'Not Assigned'}</p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && <p>Documents section (Under construction)</p>}
              {activeTab === 'attendance' && <p>Attendance records (Under construction)</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
