import { seedChefs } from '../data/chefs';
import type { ChefCandidate } from '../types';

/**
 * Stand-in for public web and job-board discovery.
 * Every row is a potential record. Submitting a chef application is what structures the profile.
 */
export function matchesDiscoveryQuery(candidate: ChefCandidate, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [
    candidate.name,
    candidate.role,
    candidate.location,
    candidate.summary,
    ...candidate.cuisine,
    ...candidate.skills,
  ].join(' ').toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

export function searchPublicSources(query: string): Promise<ChefCandidate[]> {
  const rows = seedChefs
    .filter((chef) => matchesDiscoveryQuery(chef, query))
    .map((chef) => ({
      ...chef,
      cuisine: [...chef.cuisine],
      skills: [...chef.skills],
    }));

  return new Promise((resolve) => {
    window.setTimeout(() => resolve(rows), 700);
  });
}
