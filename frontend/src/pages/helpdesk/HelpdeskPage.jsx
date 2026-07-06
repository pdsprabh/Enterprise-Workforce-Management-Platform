import { useState, useEffect } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import TicketCard from '../../components/helpdesk/TicketCard';
import CreateTicketModal from '../../components/helpdesk/CreateTicketModal';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import { TICKET_STATUS, TICKET_STATUS_LABELS } from '../../utils/constants';
import './HelpdeskPage.css';
import '../../components/projects/Projects.css'; // reuse filter-chip styles

const TABS = [
  { key: 'my',  label: 'My Tickets' },
  { key: 'all', label: 'All Tickets' },
];

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: TICKET_STATUS.OPEN,        label: TICKET_STATUS_LABELS[TICKET_STATUS.OPEN] },
  { key: TICKET_STATUS.IN_PROGRESS, label: TICKET_STATUS_LABELS[TICKET_STATUS.IN_PROGRESS] },
  { key: TICKET_STATUS.RESOLVED,    label: TICKET_STATUS_LABELS[TICKET_STATUS.RESOLVED] },
  { key: TICKET_STATUS.CLOSED,      label: TICKET_STATUS_LABELS[TICKET_STATUS.CLOSED] },
];

export default function HelpdeskPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('my');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/helpdesk');
      // Format tickets for TicketCard
      const formatted = res.data.data.map(t => ({
        ...t,
        id: t._id,
        ticketNo: `TKT-${t._id.substring(t._id.length - 4).toUpperCase()}`,
        raisedBy: t.raisedBy?.name || 'Unknown',
        assignedTo: t.assignedToIT?.name || 'Unassigned',
      }));
      setTickets(formatted);
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const currentTickets = activeTab === 'my'
    ? tickets.filter((t) => t.raisedBy === user?.name) // Note: In a real app, backend filters 'my' tickets. Since Employee only gets 'my' tickets anyway, this works, but for admins it shows tickets they raised.
    : tickets;

  const filteredTickets = statusFilter === 'all'
    ? currentTickets
    : currentTickets.filter((t) => t.status === statusFilter);

  // Summary counts across all tickets
  const counts = {
    [TICKET_STATUS.OPEN]:        tickets.filter((t) => t.status === TICKET_STATUS.OPEN).length,
    [TICKET_STATUS.IN_PROGRESS]: tickets.filter((t) => t.status === TICKET_STATUS.IN_PROGRESS).length,
    [TICKET_STATUS.RESOLVED]:    tickets.filter((t) => t.status === TICKET_STATUS.RESOLVED).length,
    [TICKET_STATUS.CLOSED]:      tickets.filter((t) => t.status === TICKET_STATUS.CLOSED).length,
  };

  async function handleNewTicket(ticketData) {
    try {
      await api.post('/helpdesk', ticketData);
      showToast('Ticket created successfully!', 'success');
      setShowCreateModal(false);
      fetchTickets(); // Refresh list
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create ticket', 'error');
    }
  }

  return (
    <div className="helpdesk-page">
      <div className="helpdesk-page__header">
        <h1 className="helpdesk-page__title">Helpdesk</h1>
        <Button onClick={() => setShowCreateModal(true)}>+ Create Ticket</Button>
      </div>

      {/* Summary row */}
      <div className="helpdesk-summary">
        <div className="helpdesk-summary__card">
          <p className="helpdesk-summary__label">Open</p>
          <p className="helpdesk-summary__value helpdesk-summary__value--open">{counts[TICKET_STATUS.OPEN]}</p>
        </div>
        <div className="helpdesk-summary__card">
          <p className="helpdesk-summary__label">In Progress</p>
          <p className="helpdesk-summary__value helpdesk-summary__value--in_progress">{counts[TICKET_STATUS.IN_PROGRESS]}</p>
        </div>
        <div className="helpdesk-summary__card">
          <p className="helpdesk-summary__label">Resolved</p>
          <p className="helpdesk-summary__value helpdesk-summary__value--resolved">{counts[TICKET_STATUS.RESOLVED]}</p>
        </div>
        <div className="helpdesk-summary__card">
          <p className="helpdesk-summary__label">Closed</p>
          <p className="helpdesk-summary__value helpdesk-summary__value--closed">{counts[TICKET_STATUS.CLOSED]}</p>
        </div>
      </div>

      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setStatusFilter('all'); }} />

      {/* Status filter */}
      <div className="helpdesk-page__filters" style={{ marginTop: 16 }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip${statusFilter === f.key ? ' filter-chip--active' : ''}`}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="helpdesk-tickets">
        {loading ? (
          <div className="helpdesk-empty">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="helpdesk-empty">No tickets match this filter.</div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleNewTicket}
      />
    </div>
  );
}
