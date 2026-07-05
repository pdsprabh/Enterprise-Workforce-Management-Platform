import { useState } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import TicketCard from '../../components/helpdesk/TicketCard';
import CreateTicketModal from '../../components/helpdesk/CreateTicketModal';
import { mockTickets } from '../../utils/mockData';
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

const MY_RAISER = 'Aarav Sharma'; // Logged-in user (mock)

export default function HelpdeskPage() {
  const [activeTab, setActiveTab] = useState('my');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);

  const currentTickets = activeTab === 'my'
    ? tickets.filter((t) => t.raisedBy === MY_RAISER)
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

  function handleNewTicket(ticketData) {
    const newTicket = {
      ...ticketData,
      ticketNo: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      raisedBy: MY_RAISER,
      assignedTo: 'Unassigned',
      status: TICKET_STATUS.OPEN,
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
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
        {filteredTickets.length === 0 ? (
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
