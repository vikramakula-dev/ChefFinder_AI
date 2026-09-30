import type { ChefApplication, JobRequirement } from '../types';

export const CHEF_APPLICATIONS_KEY = 'cheffinder_chef_applications';
export const JOB_REQUIREMENTS_KEY = 'cheffinder_job_requirements';

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

export function loadChefApplications(): ChefApplication[] {
  return readList<ChefApplication>(CHEF_APPLICATIONS_KEY);
}

export function persistChefApplications(applications: ChefApplication[]): void {
  localStorage.setItem(CHEF_APPLICATIONS_KEY, JSON.stringify(applications));
}

export function loadJobRequirements(): JobRequirement[] {
  return readList<JobRequirement>(JOB_REQUIREMENTS_KEY);
}

export function persistJobRequirements(requirements: JobRequirement[]): void {
  localStorage.setItem(JOB_REQUIREMENTS_KEY, JSON.stringify(requirements));
}
