import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import api from '../../api/axiosInstance';
import { useToast } from '../ui/Toast';

export default function ClockAction() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const { addToast } = useToast();

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance/me');
      const data = res.data.data || [];
      // Find today's active record (if they clocked in today)
      const activeRecord = data.find(r => {
        const d = new Date(r.date);
        const today = new Date();
        return d.toDateString() === today.toDateString();
      });
      setAttendance(activeRecord || null);
    } catch (err) {
      console.error('Error fetching attendance for clock action:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (attendance && attendance.clockIn && !attendance.clockOut) {
        // Clock out
        await api.post('/attendance/clock-out');
        addToast({ type: 'success', message: 'Clocked out successfully!' });
      } else {
        // Clock in
        await api.post('/attendance/clock-in');
        addToast({ type: 'success', message: 'Clocked in successfully!' });
      }
      await fetchAttendance();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to update clock status' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Button variant="secondary" disabled>Loading...</Button>;
  }

  const isClockedIn = attendance && attendance.clockIn && !attendance.clockOut;
  const isClockedOut = attendance && attendance.clockOut;

  if (isClockedOut) {
    return <Button variant="secondary" disabled>Clocked Out</Button>;
  }

  return (
    <Button 
      variant={isClockedIn ? "warning" : "primary"} 
      onClick={handleAction}
      disabled={actionLoading}
    >
      {actionLoading ? 'Updating...' : (isClockedIn ? 'Clock Out' : 'Clock In')}
    </Button>
  );
}
