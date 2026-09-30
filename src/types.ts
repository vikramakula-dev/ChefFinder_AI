export type ProfileSource = 'discovery' | 'referral' | 'job_board' | 'application';

export type ProfileStatus =
  | 'potential'
  | 'invited'
  | 'structured'
  | 'shortlisted'
  | 'contacted'
  | 'interview'
  | 'trial'
  | 'hired';

export type AppView = 'discover' | 'applications' | 'pipeline';

/**
 * A chef record in ChefFinder.
 * Phone is a contact field. V1 has no phone verification and no verified flag.
 * Public-source rows stay potential until a chef application is submitted.
 */
export interface ChefCandidate {
  id: string;
  name: string;
  role: string;
  cuisine: string[];
  location: string;
  experienceYears: number;
  phone?: string;
  email?: string;
  source: ProfileSource;
  status: ProfileStatus;
  applicationReady: boolean;
  summary: string;
  skills: string[];
  availability?: string;
  salaryExpectation?: string;
  applicationId?: string;
}

export interface ChefApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  cuisine: string[];
  experienceYears: number;
  skills: string[];
  availability: string;
  salaryExpectation: string;
  summary: string;
  submittedAt: string;
}

/** Structured matching target created when a restaurant submits a requirement. */
export interface JobRequirement {
  id: string;
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  cuisine: string[];
  minExperience: number;
  requiredSkills: string[];
  employmentType: string;
  salaryRange: string;
  notes: string;
  submittedAt: string;
}

export interface SearchFilters {
  query: string;
  role: string;
  cuisine: string;
  location: string;
  applicationReadyOnly: boolean;
}

export const PIPELINE_STAGES: ProfileStatus[] = [
  'shortlisted',
  'contacted',
  'interview',
  'trial',
  'hired',
];

export function sourceLabel(source: ProfileSource): string {
  switch (source) {
    case 'discovery':
      return 'Potential · Discovery';
    case 'referral':
      return 'Potential · Referral';
    case 'job_board':
      return 'Potential · Job board';
    case 'application':
      return 'Application';
  }
}

export function profileLabel(candidate: Pick<ChefCandidate, 'source' | 'status' | 'applicationReady'>): string {
  switch (candidate.status) {
    case 'hired':
      return 'Hired';
    case 'trial':
      return 'Trial';
    case 'interview':
      return 'Interview';
    case 'contacted':
      return 'Contacted';
    case 'shortlisted':
      return 'Shortlisted';
    case 'invited':
      return 'Invited to apply';
    case 'structured':
      return 'Application-ready';
    case 'potential':
      return candidate.applicationReady ? 'Application-ready' : sourceLabel(candidate.source);
  }
}
