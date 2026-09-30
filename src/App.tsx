import { useEffect, useMemo, useState } from 'react';
import { ApplicationsView } from './components/ApplicationsView';
import { CandidateCard } from './components/CandidateCard';
import { CandidateModal } from './components/CandidateModal';
import { DashboardStats } from './components/DashboardStats';
import { Navbar } from './components/Navbar';
import { PipelineBoard } from './components/PipelineBoard';
import { SearchFiltersSection } from './components/SearchFiltersSection';
import { SearchLoadingAnimation } from './components/SearchLoadingAnimation';
import { SettingsDialog } from './components/SettingsDialog';
import { seedChefs } from './data/chefs';
import { matchesDiscoveryQuery, searchPublicSources } from './services/googleSearchService';
import type { AppView, ChefApplication, ChefCandidate, JobRequirement, ProfileStatus, SearchFilters } from './types';
import { PIPELINE_STAGES } from './types';
import { applicationToCandidate, scoreMatch } from './utils/aiScoringEngine';
import { loadChefApplications, loadJobRequirements, persistChefApplications, persistJobRequirements } from './utils/storage';

const EMPTY_FILTERS: SearchFilters = {
  query: '',
  role: 'all',
  cuisine: 'all',
  location: '',
  applicationReadyOnly: false,
};

function nextStage(status: ProfileStatus): ProfileStatus | null {
  const index = PIPELINE_STAGES.indexOf(status);
  if (index === -1) return 'shortlisted';
  if (index >= PIPELINE_STAGES.length - 1) return null;
  return PIPELINE_STAGES[index + 1];
}

function passesFilters(candidate: ChefCandidate, filters: SearchFilters): boolean {
  if (filters.role !== 'all' && candidate.role !== filters.role) return false;
  if (filters.cuisine !== 'all' && !candidate.cuisine.some((cuisine) => cuisine.toLowerCase() === filters.cuisine.toLowerCase())) {
    return false;
  }
  if (filters.location.trim() && !candidate.location.toLowerCase().includes(filters.location.trim().toLowerCase())) {
    return false;
  }
  if (filters.applicationReadyOnly && !candidate.applicationReady) return false;
  return true;
}

export default function App() {
  const [view, setView] = useState<AppView>('discover');
  const [applications, setApplications] = useState<ChefApplication[]>(() => loadChefApplications());
  const [requirements, setRequirements] = useState<JobRequirement[]>(() => loadJobRequirements());
  const [activeRequirementId, setActiveRequirementId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<Record<string, ProfileStatus>>({});
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [discovery, setDiscovery] = useState<ChefCandidate[]>([]);
  const [searching, setSearching] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<ChefApplication> | null>(null);
  const [draftToken, setDraftToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setSearching(true);
    void searchPublicSources(submittedQuery).then((rows) => {
      if (cancelled) return;
      setDiscovery(rows);
      setSearching(false);
    });
    return () => {
      cancelled = true;
    };
  }, [submittedQuery]);

  const activeRequirement = requirements.find((requirement) => requirement.id === activeRequirementId)
    ?? requirements[0]
    ?? null;

  const roster = useMemo(() => {
    const structured = applications.map(applicationToCandidate);
    const structuredIds = new Set(structured.map((candidate) => candidate.id));
    const merged = [
      ...structured,
      ...seedChefs.filter((chef) => !structuredIds.has(chef.id)),
    ];
    return merged.map((candidate) => ({
      ...candidate,
      status: pipeline[candidate.id] ?? candidate.status,
    }));
  }, [applications, pipeline]);

  const scoredRoster = useMemo(
    () => roster.map((candidate) => ({
      candidate,
      breakdown: scoreMatch(candidate, activeRequirement),
    })),
    [roster, activeRequirement],
  );

  const visible = useMemo(() => {
    const discoveredIds = new Set(discovery.map((candidate) => candidate.id));
    return scoredRoster
      .filter(({ candidate }) => {
        if (candidate.source === 'application') return matchesDiscoveryQuery(candidate, submittedQuery);
        return discoveredIds.has(candidate.id);
      })
      .filter(({ candidate }) => passesFilters(candidate, filters))
      .sort((a, b) => b.breakdown.score - a.breakdown.score);
  }, [scoredRoster, discovery, submittedQuery, filters]);

  const roleOptions = useMemo(
    () => [...new Set(roster.map((candidate) => candidate.role))].sort(),
    [roster],
  );
  const cuisineOptions = useMemo(
    () => [...new Set(roster.flatMap((candidate) => candidate.cuisine))].sort(),
    [roster],
  );

  const discoveryCount = roster.filter((candidate) => candidate.source !== 'application').length;
  const applicationReadyCount = roster.filter((candidate) => candidate.applicationReady).length;
  const pipelineItems = scoredRoster
    .filter(({ candidate }) => PIPELINE_STAGES.includes(candidate.status))
    .map(({ candidate, breakdown }) => ({ candidate, score: breakdown.score }));

  const selected = scoredRoster.find((item) => item.candidate.id === selectedId) ?? null;

  function shortlist(id: string) {
    setPipeline((current) => {
      if (PIPELINE_STAGES.includes(current[id])) return current;
      return { ...current, [id]: 'shortlisted' };
    });
  }

  function advance(id: string) {
    setPipeline((current) => {
      const candidate = roster.find((item) => item.id === id);
      const status = current[id] ?? candidate?.status ?? 'potential';
      const upcoming = nextStage(status);
      if (!upcoming) return current;
      return { ...current, [id]: upcoming };
    });
  }

  function invite(candidate: ChefCandidate) {
    setPipeline((current) => {
      if (PIPELINE_STAGES.includes(current[candidate.id])) return current;
      return { ...current, [candidate.id]: 'invited' };
    });
    setDraft({
      fullName: candidate.name,
      phone: candidate.phone ?? '',
      email: candidate.email ?? '',
      location: candidate.location,
      role: candidate.role,
      cuisine: candidate.cuisine,
      experienceYears: candidate.experienceYears,
      skills: candidate.skills,
    });
    setDraftToken((token) => token + 1);
    setSelectedId(null);
    setView('applications');
  }

  function submitApplication(application: ChefApplication) {
    const next = [application, ...applications];
    setApplications(next);
    persistChefApplications(next);
    setDraft(null);
  }

  function submitRequirement(requirement: JobRequirement) {
    const next = [requirement, ...requirements];
    setRequirements(next);
    persistJobRequirements(next);
    setActiveRequirementId(requirement.id);
  }

  const scoreCaption = activeRequirement ? 'Match' : 'Preview';

  return (
    <div className="app-shell">
      <Navbar view={view} onView={setView} onOpenSettings={() => setSettingsOpen(true)} />
      <main>
        <section className="hero">
          <p className="eyebrow">V1 · Application first</p>
          <h1>Hire chefs from submitted applications.</h1>
          <p>
            Discovery records stay potential until a chef applies. A restaurant requirement becomes the matching target, and the score uses role, cuisine, location, experience, skills, and application readiness.
          </p>
          {activeRequirement && (
            <p className="target" data-testid="active-target">
              Matching target: {activeRequirement.role} at {activeRequirement.restaurantName}, {activeRequirement.location}
            </p>
          )}
        </section>

        <DashboardStats
          discoveryCount={discoveryCount}
          applicationReadyCount={applicationReadyCount}
          requirementCount={requirements.length}
          pipelineCount={pipelineItems.length}
        />

        {view === 'discover' && (
          <>
            <SearchFiltersSection
              filters={filters}
              roles={roleOptions}
              cuisines={cuisineOptions}
              onChange={setFilters}
              onSearch={() => setSubmittedQuery(filters.query)}
            />
            {searching ? (
              <SearchLoadingAnimation />
            ) : visible.length === 0 ? (
              <p className="empty" data-testid="empty-results">No candidates match this search.</p>
            ) : (
              <section className="card-grid" aria-label="Candidates">
                {visible.map(({ candidate, breakdown }) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    score={breakdown.score}
                    scoreCaption={scoreCaption}
                    onOpen={() => setSelectedId(candidate.id)}
                    onShortlist={() => shortlist(candidate.id)}
                  />
                ))}
              </section>
            )}
          </>
        )}

        {view === 'applications' && (
          <ApplicationsView
            applications={applications}
            requirements={requirements}
            draft={draft}
            draftToken={draftToken}
            activeRequirementId={activeRequirement?.id ?? null}
            onSubmitApplication={submitApplication}
            onSubmitRequirement={submitRequirement}
            onSelectRequirement={setActiveRequirementId}
          />
        )}

        {view === 'pipeline' && (
          <PipelineBoard
            items={pipelineItems}
            onOpen={setSelectedId}
            onAdvance={advance}
          />
        )}
      </main>

      {selected && (
        <CandidateModal
          candidate={selected.candidate}
          requirement={activeRequirement}
          breakdown={selected.breakdown}
          onClose={() => setSelectedId(null)}
          onInvite={() => invite(selected.candidate)}
          onShortlist={() => shortlist(selected.candidate.id)}
          onAdvance={() => advance(selected.candidate.id)}
        />
      )}
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
