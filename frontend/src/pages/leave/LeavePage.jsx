import { useState } from 'react';
import TabNav from '../../components/ui/TabNav';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LeaveBalanceCard from '../../components/leave/LeaveBalanceCard';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import { useToast } from '../../components/ui/Toast';
import {
  mockLeaveRequests,
  mockLeaveBalance,
  mockTeamLeaveRequests,
} from '../../utils/mockData';
import { LEAVE_TYPE_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import './LeavePage.css';

const TABS = [
  { key: 'my-leaves', label: 'My Leaves' },
  { key: 'balance', label: 'Leave Balance' },
  { key: 'team', label: 'Team Requests' },
];

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
  const [activeTab, setActiveTab] = useState('my-leaves');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState(mockLeaveRequests);
  const [teamLeaves, setTeamLeaves] = useState(mockTeamLeaveRequests);
  const { addToast } = useToast();

  function handleApplyLeave(data) {
    setSubmitLoading(true);
    setTimeout(() => {
      const newLeave = {
        id: `lr-${Date.now()}`,
        type: data.type,
        from: data.startDate,
        to: data.endDate,
        days: data.businessDays,
        reason: data.reason,
        status: 'pending',
        appliedOn: new Date().toISOString().split('T')[0],
      };
      setMyLeaves((prev) => [newLeave, ...prev]);
      setSubmitLoading(false);
      setModalOpen(false);
      addToast({ type: 'success', message: 'Leave request submitted successfully!' });
    }, 800);
  }

  function handleCancelLeave(id) {
    setMyLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'cancelled' } : l))
    );
    addToast({ type: 'info', message: 'Leave request cancelled.' });
  }

  function handleApproveTeam(id) {
    setTeamLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l))
    );
    addToast({ type: 'success', message: 'Leave approved.' });
  }

  function handleRejectTeam(id) {
    setTeamLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l))
    );
    addToast({ type: 'warning', message: 'Leave rejected.' });
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
                    <tr key={leave.id}>
                      <td>{LEAVE_TYPE_LABELS[leave.type] || leave.type}</td>
                      <td>{formatDate(leave.from)}</td>
                      <td>{formatDate(leave.to)}</td>
                      <td>{leave.days}</td>
                      <td>
                        <Badge color={leaveBadgeColor(leave.status)}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </Badge>
                      </td>
                      <td>{formatDate(leave.appliedOn)}</td>
                      <td>
                        {leave.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelLeave(leave.id)}
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
            {mockLeaveBalance.map((b) => (
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
                    <tr key={req.id}>
                      <td style={{ fontWeight: 500 }}>{req.employeeName}</td>
                      <td>{req.department}</td>
                      <td>{LEAVE_TYPE_LABELS[req.type] || req.type}</td>
                      <td>{formatDate(req.from)}</td>
                      <td>{formatDate(req.to)}</td>
                      <td>{req.days}</td>
                      <td>
                        <Badge color={leaveBadgeColor(req.status)}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {req.status === 'pending' && (
                          <div className="team-req-actions">
                            <Button variant="primary" size="sm" onClick={() => handleApproveTeam(req.id)}>Approve</Button>
                            <Button variant="danger" size="sm" onClick={() => handleRejectTeam(req.id)}>Reject</Button>
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
