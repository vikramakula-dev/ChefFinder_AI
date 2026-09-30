import { seedChefs } from '../data/chefs';
import type { ChefCandidate } from '../types';

/**
 * Filters the in-app roster (seeded discovery rows and submitted applications).
 * Live web discovery is the ChefFinder Programmable Search element, not this function.
 * Every seeded row stays a potential record until a chef application is submitted.
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
