import type { ChefCandidate, ProfileStatus } from '../types';
import { PIPELINE_STAGES, profileLabel } from '../types';

interface PipelineItem {
  candidate: ChefCandidate;
  score: number;
}

interface PipelineBoardProps {
  items: PipelineItem[];
  onOpen: (id: string) => void;
  onAdvance: (id: string) => void;
}

const COLUMN_LABEL: Record<ProfileStatus, string> = {
  potential: 'Potential',
  invited: 'Invited',
  structured: 'Structured',
  shortlisted: 'Shortlist',
  contacted: 'Contact',
  interview: 'Interview',
  trial: 'Trial',
  hired: 'Hire',
};

export function PipelineBoard({ items, onOpen, onAdvance }: PipelineBoardProps) {
  return (
    <section className="board" data-testid="pipeline-board" aria-label="Hiring pipeline">
      {PIPELINE_STAGES.map((stage) => {
        const column = items.filter((item) => item.candidate.status === stage);
        return (
          <div key={stage} className="column">
            <header>
              <h2>{COLUMN_LABEL[stage]}</h2>
              <span>{column.length}</span>
            </header>
            {column.length === 0 && <p className="fine">No chefs in this stage.</p>}
            {column.map((item) => (
              <article key={item.candidate.id} className="column-card">
                <p className="eyebrow">{profileLabel(item.candidate)}</p>
                <h3>{item.candidate.name}</h3>
                <p>{item.candidate.role}</p>
                <p className="fine">Score {item.score}</p>
                <div className="card-actions">
                  <button type="button" className="button ghost" onClick={() => onOpen(item.candidate.id)}>
                    Open
                  </button>
                  {stage !== 'hired' && (
                    <button type="button" className="button" onClick={() => onAdvance(item.candidate.id)}>
                      Advance
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        );
      })}
    </section>
  );
}
