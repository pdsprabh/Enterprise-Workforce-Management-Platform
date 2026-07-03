import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { mockEmployees } from '../../utils/mockData';
import { formatDate, formatCurrency } from '../../utils/formatters';

export default function EmployeeListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Filter and pagination logic
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return mockEmployees;
    const lowerQuery = searchQuery.toLowerCase();
    return mockEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery) ||
        emp.department.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleRowClick = (employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'on_leave': return 'warning';
      default: return 'primary';
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={row.name} size="sm" />
          <div>
            <div style={{ fontWeight: 500 }}>{row.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Designation',
      accessor: 'designation',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge color={getStatusColor(row.status)}>
          {row.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Join Date',
      accessor: 'joinDate',
      cell: (row) => formatDate(row.joinDate)
    }
  ];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Employees</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Manage your organization's workforce
          </p>
        </div>
        <Button onClick={() => navigate('/employees/add')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, marginRight: 8 }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader style={{ padding: '16px' }}>
          <SearchBar 
            placeholder="Search employees by name, email, or department..." 
            onSearch={setSearchQuery} 
          />
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={paginatedData}
            onRowClick={handleRowClick}
            emptyMessage="No employees found matching your search."
          />
        </CardBody>
        {totalPages > 1 && (
          <div style={{ padding: '0 16px' }}>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </Card>
    </div>
  );
}
