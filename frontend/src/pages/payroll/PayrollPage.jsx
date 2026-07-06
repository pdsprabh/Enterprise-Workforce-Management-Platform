import { useState, useEffect } from 'react';
import SalaryBreakdown from '../../components/payroll/SalaryBreakdown';
import PayslipModal from '../../components/payroll/PayslipModal';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import './PayrollPage.css';

export default function PayrollPage() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchPayslips() {
      try {
        const res = await api.get('/payroll/me');
        const data = res.data.data || [];
        setPayslips(data);
        if (data.length > 0) {
          setMonth(data[0].month);
          setYear(data[0].year);
        } else {
          const d = new Date();
          setMonth(d.toLocaleString('en-US', { month: 'long' }));
          setYear(d.getFullYear());
        }
      } catch (err) {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to fetch payroll data' });
      } finally {
        setLoading(false);
      }
    }
    fetchPayslips();
  }, []);

  // For demo purposes, build a summary based on the current selected month/year payslip
  const currentPayslip = payslips.find(p => p.month === month && p.year === year);
  const summary = currentPayslip ? {
    grossSalary: currentPayslip.grossSalary,
    deductions: currentPayslip.deductions,
    netSalary: currentPayslip.netSalary,
    taxYTD: currentPayslip.taxYTD || 0,
    breakdown: currentPayslip.breakdown || []
  } : {
    grossSalary: 0,
    deductions: 0,
    netSalary: 0,
    taxYTD: 0,
    breakdown: []
  };

  const monthLabel = `${month} ${year}`;

  function prevMonth() {
    const d = new Date(`${month} 1, ${year}`);
    d.setMonth(d.getMonth() - 1);
    setMonth(d.toLocaleString('en-US', { month: 'long' }));
    setYear(d.getFullYear());
  }

  function nextMonth() {
    const d = new Date(`${month} 1, ${year}`);
    d.setMonth(d.getMonth() + 1);
    setMonth(d.toLocaleString('en-US', { month: 'long' }));
    setYear(d.getFullYear());
  }

  // Build payslip detail object for the modal
  function buildPayslipDetail(ps) {
    return {
      month: ps.month,
      year: ps.year,
      gross: ps.grossSalary,
      deductions: ps.deductions,
      net: ps.netSalary,
      breakdown: ps.breakdown || []
    };
  }

  return (
    <div className="payroll-page">
      {/* Header */}
      <div className="payroll-page__header">
        <h1 className="payroll-page__title">Payroll Overview</h1>
        <div className="payroll-page__month-nav">
          <button onClick={prevMonth} aria-label="Previous month">‹</button>
          <span className="payroll-page__month-label">{monthLabel}</span>
          <button onClick={nextMonth} aria-label="Next month">›</button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="payroll-page__stats">
        <div className="payroll-stat">
          <p className="payroll-stat__label">Gross Salary</p>
          <p className="payroll-stat__value">{formatCurrency(summary.grossSalary)}</p>
        </div>
        <div className="payroll-stat payroll-stat--deductions">
          <p className="payroll-stat__label">Deductions</p>
          <p className="payroll-stat__value">{formatCurrency(summary.deductions)}</p>
        </div>
        <div className="payroll-stat payroll-stat--net">
          <p className="payroll-stat__label">Net Salary</p>
          <p className="payroll-stat__value">{formatCurrency(summary.netSalary)}</p>
        </div>
        <div className="payroll-stat payroll-stat--tax">
          <p className="payroll-stat__label">Tax (YTD)</p>
          <p className="payroll-stat__value">{formatCurrency(summary.taxYTD)}</p>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="payroll-page__card">
        <h2 className="payroll-page__section-title">Salary Breakdown</h2>
        <SalaryBreakdown components={summary.breakdown} gross={summary.grossSalary} />
      </div>

      {/* Payslip History */}
      <div className="payroll-page__card">
        <h2 className="payroll-page__section-title">Payslip History</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="payslip-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((ps) => (
                <tr key={ps._id}>
                  <td style={{ fontWeight: 500 }}>{ps.month} {ps.year}</td>
                  <td>{formatCurrency(ps.grossSalary)}</td>
                  <td style={{ color: 'var(--color-danger)' }}>− {formatCurrency(ps.deductions)}</td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{formatCurrency(ps.netSalary)}</td>
                  <td>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(buildPayslipDetail(ps))}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  );
}
