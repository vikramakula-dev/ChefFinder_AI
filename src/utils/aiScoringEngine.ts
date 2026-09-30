import type { ChefApplication, ChefCandidate, JobRequirement } from '../types';

export interface ScoreFactor {
  label: string;
  points: number;
}

export interface ScoreBreakdown {
  score: number;
  factors: ScoreFactor[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const next = normalize(value);
    if (!next || seen.has(next)) continue;
    seen.add(next);
    result.push(next);
  }
  return result;
}

function coverage(have: string[], need: string[]): number {
  const needed = unique(need);
  if (needed.length === 0) return 1;
  const owned = new Set(unique(have));
  const hits = needed.filter((item) => owned.has(item)).length;
  return hits / needed.length;
}

/**
 * Score a candidate against a restaurant requirement.
 * Signals: role, cuisine, location, experience, skills, and application readiness.
 * Phone numbers are contact data and are ignored. There is no verification signal.
 */
export function scoreMatch(candidate: ChefCandidate, requirement: JobRequirement | null): ScoreBreakdown {
  if (!requirement) {
    const readiness = candidate.applicationReady ? 25 : 0;
    return {
      score: 30 + readiness,
      factors: [
        { label: 'Profile on file', points: 30 },
        { label: 'Application readiness', points: readiness },
      ],
    };
  }

  const role = normalize(candidate.role);
  const targetRole = normalize(requirement.role);
  let rolePoints = 0;
  if (role && role === targetRole) rolePoints = 25;
  else if (role && targetRole && (role.includes(targetRole) || targetRole.includes(role))) rolePoints = 10;

  const cuisinePoints = Math.round(20 * coverage(candidate.cuisine, requirement.cuisine));
  const locationPoints = normalize(candidate.location) === normalize(requirement.location) ? 15 : 0;
  const experienceGap = Math.max(0, requirement.minExperience - candidate.experienceYears);
  const experiencePoints = Math.max(0, 15 - experienceGap * 5);
  const skillPoints = Math.round(15 * coverage(candidate.skills, requirement.requiredSkills));
  const readinessPoints = candidate.applicationReady ? 10 : 0;

  const factors: ScoreFactor[] = [
    { label: 'Role alignment', points: rolePoints },
    { label: 'Cuisine overlap', points: cuisinePoints },
    { label: 'Location', points: locationPoints },
    { label: 'Experience', points: experiencePoints },
    { label: 'Skills', points: skillPoints },
    { label: 'Application readiness', points: readinessPoints },
  ];

  const score = Math.min(100, factors.reduce((sum, factor) => sum + factor.points, 0));
  return { score, factors };
}

/** A submitted chef application becomes a structured, application-ready candidate. */
export function applicationToCandidate(application: ChefApplication): ChefCandidate {
  const summary = application.summary.trim()
    || `${application.fullName.trim()} submitted an application for ${application.role.trim()}.`;

  return {
    id: `application-${application.id}`,
    name: application.fullName.trim(),
    role: application.role.trim(),
    cuisine: application.cuisine,
    location: application.location.trim(),
    experienceYears: application.experienceYears,
    phone: application.phone.trim() || undefined,
    email: application.email.trim() || undefined,
    source: 'application',
    status: 'structured',
    applicationReady: true,
    summary,
    skills: application.skills,
    availability: application.availability.trim() || undefined,
    salaryExpectation: application.salaryExpectation.trim() || undefined,
    applicationId: application.id,
  };
}
