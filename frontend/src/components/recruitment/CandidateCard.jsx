import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CANDIDATE_STAGE_LABELS, CANDIDATE_STAGES } from '../../utils/constants';
import './Recruitment.css';

function stageBadgeColor(stage) {
  switch (stage) {
    case CANDIDATE_STAGES.APPLIED:    return 'primary';
    case CANDIDATE_STAGES.SCREENING:  return 'info';
    case CANDIDATE_STAGES.INTERVIEW:  return 'warning';
    case CANDIDATE_STAGES.OFFER:      return 'success';
    case CANDIDATE_STAGES.HIRED:      return 'success';
    case CANDIDATE_STAGES.REJECTED:   return 'danger';
    default:                           return 'secondary';
  }
}

// Determine which next stage to advance to
const ADVANCE_MAP = {
  [CANDIDATE_STAGES.APPLIED]:   CANDIDATE_STAGES.SCREENING,
  [CANDIDATE_STAGES.SCREENING]: CANDIDATE_STAGES.INTERVIEW,
  [CANDIDATE_STAGES.INTERVIEW]: CANDIDATE_STAGES.OFFER,
  [CANDIDATE_STAGES.OFFER]:     CANDIDATE_STAGES.HIRED,
};

/**
 * CandidateCard — card for a recruitment pipeline candidate.
 *
 * @param {{ id, name, email, role, stage, appliedDate, avatar, resumeUrl, aiAnalysis, positionAppliedFor }} candidate
 * @param {(id: string, stage: string) => void} onAdvance
 * @param {(id: string) => void} onReject
 * @param {(candidate: object) => void} onAnalyze
 */
export default function CandidateCard({ candidate, onAdvance, onReject, onAnalyze, isAnalyzing }) {
  const { _id, name, email, positionAppliedFor, role, stage, avatar, resumeUrl, aiAnalysis } = candidate;
  const canAdvance = !!ADVANCE_MAP[stage];
  const canReject = stage !== CANDIDATE_STAGES.HIRED && stage !== CANDIDATE_STAGES.REJECTED;

  const displayRole = role || positionAppliedFor;

  return (
    <div className="candidate-card">
      <div className="candidate-card__top">
        <Avatar name={name} src={avatar} size="sm" />
        <div className="candidate-card__info">
          <p className="candidate-card__name">{name}</p>
          <p className="candidate-card__role">{displayRole}</p>
        </div>
        <Badge color={stageBadgeColor(stage)}>
          {CANDIDATE_STAGE_LABELS[stage] || stage}
        </Badge>
      </div>

      <p className="candidate-card__email">{email}</p>

      {/* AI & Resume Actions */}
      <div className="candidate-card__actions" style={{ marginBottom: '8px' }}>
        {resumeUrl && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(resumeUrl, '_blank')}
          >
            📄 Resume
          </Button>
        )}
        {resumeUrl && !aiAnalysis?.overallScore && (
          <Button
            variant="primary"
            size="sm"
            loading={isAnalyzing}
            onClick={() => onAnalyze(candidate)}
          >
            {isAnalyzing ? 'Analyzing...' : '✨ AI Analyze'}
          </Button>
        )}
        {aiAnalysis?.overallScore > 0 && (
          <Button
            variant="info"
            size="sm"
            onClick={() => onAnalyze(candidate)}
          >
            🤖 View AI Analysis
          </Button>
        )}
      </div>

      {(canAdvance || canReject) && (
        <div className="candidate-card__actions">
          {canAdvance && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAdvance(_id, ADVANCE_MAP[stage])}
            >
              Advance
            </Button>
          )}
          {canReject && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(_id)}
            >
              Reject
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
