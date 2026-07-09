import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import './Recruitment.css';

export default function AIAnalysisModal({ candidate, isOpen, onClose }) {
  if (!candidate || !candidate.aiAnalysis) return null;

  const { aiAnalysis, name, role } = candidate;

  // Determine score color
  const score = aiAnalysis.overallScore || 0;
  let scoreColorClass = 'score-low';
  if (score >= 80) scoreColorClass = 'score-high';
  else if (score >= 60) scoreColorClass = 'score-med';

  const adaScore = aiAnalysis.adaScore || 0;
  let adaColorClass = 'score-low';
  if (adaScore >= 80) adaColorClass = 'score-high';
  else if (adaScore >= 60) adaColorClass = 'score-med';

  return (
    <Modal title={`AI Resume Analysis: ${name}`} isOpen={isOpen} onClose={onClose} size="lg">
      <div className="ai-analysis-content">
        <div className="ai-score-banner" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="ai-score-info">
              <h4>Role Fit Score</h4>
              <p className="ai-role-context">Based on requirements for <strong>{role || candidate.positionAppliedFor}</strong></p>
            </div>
            <div className={`ai-score-circle ${scoreColorClass}`}>
              {score}%
            </div>
          </div>

          {adaScore > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="ai-score-info" style={{ textAlign: 'right' }}>
                <h4>ADA / ATS Score</h4>
                <p className="ai-role-context">System compatibility</p>
              </div>
              <div className={`ai-score-circle ${adaColorClass}`}>
                {adaScore}%
              </div>
            </div>
          )}
        </div>

        <div className="ai-overview-box">
          <h4>Detailed Overview</h4>
          <p>{aiAnalysis.detailedOverview}</p>
        </div>

        <div className="ai-lists-container">
          <div className="ai-list-box strengths">
            <h4>Strengths (Good at)</h4>
            <ul>
              {aiAnalysis.strengths?.length > 0 ? (
                aiAnalysis.strengths.map((str, i) => <li key={i}>{str}</li>)
              ) : (
                <li>No specific strengths identified.</li>
              )}
            </ul>
          </div>

          <div className="ai-list-box weaknesses">
            <h4>Weaknesses (Lacks)</h4>
            <ul>
              {aiAnalysis.weaknesses?.length > 0 ? (
                aiAnalysis.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)
              ) : (
                <li>No specific weaknesses identified.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="ai-lists-container" style={{ marginTop: '16px' }}>
          <div className="ai-list-box">
            <h4>Languages</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {aiAnalysis.languages?.length > 0 ? (
                aiAnalysis.languages.map((lang, i) => <Badge key={i} color="primary">{lang}</Badge>)
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>No languages identified.</span>
              )}
            </div>
          </div>

          <div className="ai-list-box">
            <h4>Relevant Technologies</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {aiAnalysis.relevantTechnologies?.length > 0 ? (
                aiAnalysis.relevantTechnologies.map((tech, i) => <Badge key={i} color="info">{tech}</Badge>)
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>No specific technologies identified.</span>
              )}
            </div>
          </div>
        </div>

        <div className="ai-modal-actions">
          <Button variant="secondary" onClick={onClose}>Close Analysis</Button>
        </div>
      </div>
    </Modal>
  );
}
