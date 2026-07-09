import { useState, useEffect } from 'react';
import TabNav from '../../components/ui/TabNav';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LeaveBalanceCard from '../../components/leave/LeaveBalanceCard';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import { useToast } from '../../components/ui/Toast';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axiosInstance';
import { LEAVE_TYPE_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import './LeavePage.css';

// "Team Requests" tab is only meaningful for HR/Admin roles that can approve leaves
const BASE_TABS = [
  { key: 'my-leaves', label: 'My Leaves' },
  { key: 'balance', label: 'Leave Balance' },
];
const TEAM_TAB = { key: 'team', label: 'Team Requests' };
const HR_ROLES = ['HR Manager', 'Super Admin', 'Organization Admin'];

function leaveBadgeColor(status) {
  switch (status) {
    case 'approved':  return 'success';
    case 'rejected':  return 'danger';
    case 'pending':   return 'warning';
    case 'cancelled': return 'secondary';
    default:          return 'primary';
  }
}

export default function LeavePage() {
  const { user } = useAuth();
  const canManageLeaves = HR_ROLES.includes(user?.role);
  const TABS = canManageLeaves ? [...BASE_TABS, TEAM_TAB] : BASE_TABS;

  const [activeTab, setActiveTab] = useState('my-leaves');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leavesRes, balanceRes, teamRes] = await Promise.allSettled([
        api.get('/leaves/me'),
        api.get('/leaves/balance'),
        api.get('/leaves')
      ]);

      if (leavesRes.status === 'fulfilled' && leavesRes.value.data.data) {
        setMyLeaves(leavesRes.value.data.data);
      }
      if (balanceRes.status === 'fulfilled' && balanceRes.value.data.data) {
        const balData = balanceRes.value.data.data;
        setLeaveBalance([
          { type: 'annual', label: 'Annual Leave', total: balData.totalQuota, used: balData.used, available: balData.remaining },
          { type: 'sick', label: 'Sick Leave', total: 10, used: 0, available: 10 },
          { type: 'unpaid', label: 'Unpaid Leave', total: 0, used: 0, available: 0 }
        ]);
      }
      if (teamRes.status === 'fulfilled' && teamRes.value.data.data) {
        setTeamLeaves(teamRes.value.data.data);
      }
    } catch (error) {
      console.error('Error fetching leave data', error);
      addToast({ type: 'error', message: 'Failed to fetch leave data.' });
    } finally {
      setIsLoading(false);
    }
  };

  async function handleApplyLeave(data) {
    setSubmitLoading(true);
    try {
      await api.post('/leaves', {
        leaveType: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      });
      addToast({ type: 'success', message: 'Leave request submitted successfully!' });
      setModalOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting leave', error);
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to submit leave request.' });
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleCancelLeave(id) {
    try {
      // PUT /leaves/:id/status is HR-restricted; employees use the cancel endpoint
      await api.put(`/leaves/${id}/cancel`);
      addToast({ type: 'info', message: 'Leave request cancelled.' });
      fetchData();
    } catch (error) {
      // Fallback: try the generic status endpoint (works for HR+ roles)
      try {
        await api.put(`/leaves/${id}/status`, { status: 'cancelled' });
        addToast({ type: 'info', message: 'Leave request cancelled.' });
        fetchData();
      } catch {
        addToast({ type: 'error', message: 'Failed to cancel leave request.' });
      }
    }
  }

  async function handleApproveTeam(id) {
    try {
      await api.put(`/leaves/${id}/status`, { status: 'approved' });
      addToast({ type: 'success', message: 'Leave approved.' });
      fetchData(); // Refresh so the row updates
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to approve leave.' });
    }
  }

  async function handleRejectTeam(id) {
    try {
      await api.put(`/leaves/${id}/status`, { status: 'rejected' });
      addToast({ type: 'warning', message: 'Leave rejected.' });
      fetchData(); // Refresh so the row updates
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to reject leave.' });
    }
  }

  return (
    <div className="leave-page">
      {/* Header */}
      <div className="leave-page__header">
        <h1 className="leave-page__title">Leave Management</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Apply Leave
        </Button>
      </div>

      {/* Tabs */}
      <div className="leave-page__tabs">
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="leave-page__content" role="tabpanel">
        {/* My Leaves */}
        {activeTab === 'my-leaves' && (
          <div className="leave-page__card">
            {myLeaves.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No leave requests yet.
              </p>
            ) : (
              <table className="my-leaves-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{LEAVE_TYPE_LABELS[leave.leaveType] || leave.leaveType}</td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>{leave.totalDays}</td>
                      <td>
                        <Badge color={leaveBadgeColor(leave.status)}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </Badge>
                      </td>
                      <td>{formatDate(leave.createdAt)}</td>
                      <td>
                        {leave.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelLeave(leave._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Leave Balance */}
        {activeTab === 'balance' && (
          <div className="leave-balance-grid">
            {leaveBalance.map((b) => (
              <LeaveBalanceCard key={b.type} balance={b} />
            ))}
          </div>
        )}

        {/* Team Requests */}
        {activeTab === 'team' && (
          <div className="leave-page__card">
            {teamLeaves.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No team leave requests.
              </p>
            ) : (
              <table className="team-req-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamLeaves.map((req) => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 500 }}>
                        {req.employee?.user ? `${req.employee.user.firstName} ${req.employee.user.lastName}` : 'Unknown'}
                      </td>
                      <td>{req.employee?.department || 'N/A'}</td>
                      <td>{LEAVE_TYPE_LABELS[req.leaveType] || req.leaveType}</td>
                      <td>{formatDate(req.startDate)}</td>
                      <td>{formatDate(req.endDate)}</td>
                      <td>{req.totalDays}</td>
                      <td>
                        <Badge color={leaveBadgeColor(req.status)}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {req.status === 'pending' && (
                          <div className="team-req-actions">
                            <Button variant="primary" size="sm" onClick={() => handleApproveTeam(req._id)}>Approve</Button>
                            <Button variant="danger" size="sm" onClick={() => handleRejectTeam(req._id)}>Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleApplyLeave}
        loading={submitLoading}
      />
    </div>
  );
}
