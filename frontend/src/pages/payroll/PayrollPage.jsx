import { useState } from 'react';
import SalaryBreakdown from '../../components/payroll/SalaryBreakdown';
import PayslipModal from '../../components/payroll/PayslipModal';
import Button from '../../components/ui/Button';
import { mockPayrollSummary, mockPayslipHistory } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';
import './PayrollPage.css';

export default function PayrollPage() {
  const [month, setMonth] = useState(mockPayrollSummary.month);
  const [year, setYear] = useState(mockPayrollSummary.year);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // For demo purposes, always show the same summary regardless of month navigation
  const summary = mockPayrollSummary;

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
      ...summary,
      month: ps.month,
      gross: ps.gross,
      deductions: ps.deductions,
      net: ps.net,
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
              {mockPayslipHistory.map((ps) => (
                <tr key={ps.id}>
                  <td style={{ fontWeight: 500 }}>{ps.month}</td>
                  <td>{formatCurrency(ps.gross)}</td>
                  <td style={{ color: 'var(--color-danger)' }}>− {formatCurrency(ps.deductions)}</td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{formatCurrency(ps.net)}</td>
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
