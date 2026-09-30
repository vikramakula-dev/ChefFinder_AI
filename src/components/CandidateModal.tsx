import { useEffect } from 'react';
import type { ChefCandidate, JobRequirement, ProfileStatus } from '../types';
import { PIPELINE_STAGES, profileLabel } from '../types';
import type { ScoreBreakdown } from '../utils/aiScoringEngine';

interface CandidateModalProps {
  candidate: ChefCandidate;
  requirement: JobRequirement | null;
  breakdown: ScoreBreakdown;
  onClose: () => void;
  onInvite: () => void;
  onShortlist: () => void;
  onAdvance: () => void;
}

const ADVANCE_LABEL: Partial<Record<ProfileStatus, string>> = {
  shortlisted: 'Mark contacted',
  contacted: 'Move to interview',
  interview: 'Move to trial',
  trial: 'Mark hired',
};

export function CandidateModal({
  candidate,
  requirement,
  breakdown,
  onClose,
  onInvite,
  onShortlist,
  onAdvance,
}: CandidateModalProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const inPipeline = PIPELINE_STAGES.includes(candidate.status);
  const advanceLabel = ADVANCE_LABEL[candidate.status];

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-title"
        data-testid="candidate-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dialog-head">
          <div>
            <p className="eyebrow">{profileLabel(candidate)}</p>
            <h2 id="candidate-title">{candidate.name}</h2>
            <p>{candidate.role} · {candidate.location} · {candidate.experienceYears} years</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close profile">
            ×
          </button>
        </header>

        <p className="summary">{candidate.summary}</p>

        <section>
          <h3>Contact</h3>
          <p>{candidate.phone || 'No phone on file'}</p>
          <p>{candidate.email || 'No email on file'}</p>
          <p className="fine">Phone numbers are stored as contact details.</p>
        </section>

        <section>
          <h3>{requirement ? `Match to ${requirement.restaurantName}` : 'Preview score'}</h3>
          <p className="score-line" data-testid="modal-score">{breakdown.score}</p>
          <ul className="factors">
            {breakdown.factors.map((factor) => (
              <li key={factor.label}>
                <span>{factor.label}</span>
                <strong>{factor.points}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Skills and cuisine</h3>
          <ul className="chips">
            {candidate.cuisine.map((cuisine) => <li key={cuisine}>{cuisine}</li>)}
            {candidate.skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
          {candidate.availability && <p>Availability: {candidate.availability}</p>}
          {candidate.salaryExpectation && <p>Salary expectation: {candidate.salaryExpectation}</p>}
        </section>

        <div className="dialog-actions">
          {!candidate.applicationReady && (
            <button type="button" className="button" data-testid="invite-button" onClick={onInvite}>
              Invite to apply
            </button>
          )}
          {!inPipeline && (
            <button type="button" className="button ghost" onClick={onShortlist}>
              Add to shortlist
            </button>
          )}
          {advanceLabel && (
            <button type="button" className="button" onClick={onAdvance}>
              {advanceLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
