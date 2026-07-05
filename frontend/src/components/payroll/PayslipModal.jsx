import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import './Payroll.css';

/**
 * PayslipModal — detailed payslip breakdown view.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {object} payslip - payroll summary object
 */
export default function PayslipModal({ isOpen, onClose, payslip }) {
  if (!payslip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip — ${payslip.month || ''}`}
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => window.print()}>Print</Button>
        </div>
      }
    >
      {/* Earnings */}
      <div className="payslip-modal__section">
        <p className="payslip-modal__section-title">Earnings</p>
        {(payslip.breakdown || []).map((item) => (
          <div key={item.label} className="payslip-modal__row">
            <span>{item.label}</span>
            <span>{formatCurrency(item.amount)}</span>
          </div>
        ))}
        <div className="payslip-modal__row payslip-modal__row--total">
          <span>Gross Salary</span>
          <span>{formatCurrency(payslip.gross ?? payslip.grossSalary)}</span>
        </div>
      </div>

      {/* Deductions */}
      <div className="payslip-modal__section">
        <p className="payslip-modal__section-title">Deductions</p>
        {(payslip.deductionBreakdown || []).map((item) => (
          <div key={item.label} className="payslip-modal__row">
            <span>{item.label}</span>
            <span style={{ color: 'var(--color-danger, #ef4444)' }}>− {formatCurrency(item.amount)}</span>
          </div>
        ))}
        <div className="payslip-modal__row payslip-modal__row--total">
          <span>Total Deductions</span>
          <span style={{ color: 'var(--color-danger, #ef4444)' }}>− {formatCurrency(payslip.deductions)}</span>
        </div>
      </div>

      {/* Employer contributions */}
      {payslip.employerContributions && payslip.employerContributions.length > 0 && (
        <div className="payslip-modal__section">
          <p className="payslip-modal__section-title">Employer Contributions</p>
          {payslip.employerContributions.map((item) => (
            <div key={item.label} className="payslip-modal__row">
              <span>{item.label}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Net salary */}
      <div className="payslip-modal__net">
        <span>Net Salary</span>
        <span>{formatCurrency(payslip.net ?? payslip.netSalary)}</span>
      </div>
    </Modal>
  );
}
