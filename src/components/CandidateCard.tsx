import type { ChefCandidate } from '../types';
import { profileLabel } from '../types';

interface CandidateCardProps {
  candidate: ChefCandidate;
  score: number;
  scoreCaption: string;
  onOpen: () => void;
  onShortlist: () => void;
}

export function CandidateCard({
  candidate,
  score,
  scoreCaption,
  onOpen,
  onShortlist,
}: CandidateCardProps) {
  const inPipeline = ['shortlisted', 'contacted', 'interview', 'trial', 'hired'].includes(candidate.status);

  return (
    <article className="card" data-testid="candidate-card">
      <header className="card-top">
        <div>
          <p className="eyebrow">{profileLabel(candidate)}</p>
          <h3>{candidate.name}</h3>
          <p className="card-role">{candidate.role} · {candidate.location}</p>
        </div>
        <div className="score" data-testid="match-score">
          <strong>{score}</strong>
          <span>{scoreCaption}</span>
        </div>
      </header>
      <p className="summary">{candidate.summary}</p>
      <ul className="chips">
        {candidate.cuisine.map((cuisine) => (
          <li key={cuisine}>{cuisine}</li>
        ))}
        <li>{candidate.experienceYears} yrs</li>
      </ul>
      <div className="card-actions">
        <button type="button" className="button" onClick={onOpen}>
          View profile
        </button>
        <button type="button" className="button ghost" onClick={onShortlist} disabled={inPipeline}>
          {inPipeline ? 'In pipeline' : 'Shortlist'}
        </button>
      </div>
    </article>
  );
}
