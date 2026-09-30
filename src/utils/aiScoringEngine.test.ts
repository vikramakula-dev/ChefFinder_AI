import { describe, expect, it } from 'vitest';
import type { ChefCandidate, JobRequirement } from '../types';
import { seedChefs } from '../data/chefs';
import { applicationToCandidate, scoreMatch } from './aiScoringEngine';

const candidate: ChefCandidate = {
  id: 'c1',
  name: 'Ayesha Rahman',
  role: 'Head Chef',
  cuisine: ['Hyderabadi', 'North Indian'],
  location: 'Hyderabad',
  experienceYears: 12,
  phone: '+91 98480 11021',
  source: 'discovery',
  status: 'potential',
  applicationReady: true,
  summary: 'Structured application on file.',
  skills: ['Menu development', 'Costing'],
};

const requirement: JobRequirement = {
  id: 'j1',
  restaurantName: 'Charminar House',
  contactName: 'Neel',
  phone: '+91 90000 00000',
  email: 'hire@example.com',
  location: 'Hyderabad',
  role: 'Head Chef',
  cuisine: ['Hyderabadi'],
  minExperience: 8,
  requiredSkills: ['Costing'],
  employmentType: 'Full-time',
  salaryRange: '18-22 LPA',
  notes: '',
  submittedAt: '2026-09-30T00:00:00.000Z',
};

describe('scoreMatch', () => {
  it('scores role, cuisine, location, experience, skills, and application readiness', () => {
    const result = scoreMatch(candidate, requirement);
    expect(result.score).toBe(100);
    expect(result.factors.map((factor) => factor.label)).toEqual([
      'Role alignment',
      'Cuisine overlap',
      'Location',
      'Experience',
      'Skills',
      'Application readiness',
    ]);
  });

  it('ignores phone numbers when scoring', () => {
    const otherPhone = scoreMatch({ ...candidate, phone: '+1 202 555 0148' }, requirement);
    const missingPhone = scoreMatch({ ...candidate, phone: undefined }, requirement);
    expect(otherPhone.score).toBe(100);
    expect(missingPhone.score).toBe(100);
  });

  it('does not read a verified flag even if one is attached at runtime', () => {
    const withFlag = scoreMatch({ ...candidate, verified: true } as ChefCandidate, requirement);
    const withoutFlag = scoreMatch({ ...candidate, verified: false } as ChefCandidate, requirement);
    expect(withFlag).toEqual(withoutFlag);
  });

  it('gives application-ready candidates a higher score than discovery-only records', () => {
    const ready = scoreMatch(candidate, requirement).score;
    const discoveryOnly = scoreMatch({ ...candidate, applicationReady: false }, requirement).score;
    expect(ready - discoveryOnly).toBe(10);
  });
});

describe('applicationToCandidate', () => {
  it('creates a structured candidate from a chef application', () => {
    const created = applicationToCandidate({
      id: 'app-1',
      fullName: 'Meera Iyer',
      phone: ' +91 98000 11111 ',
      email: 'meera@example.com',
      location: 'Bengaluru',
      role: 'Pastry Chef',
      cuisine: ['Bakery'],
      experienceYears: 9,
      skills: ['Bread'],
      availability: 'Immediate',
      salaryExpectation: '14 LPA',
      summary: 'Applied directly.',
      submittedAt: '2026-09-30T00:00:00.000Z',
    });

    expect(created.source).toBe('application');
    expect(created.status).toBe('structured');
    expect(created.applicationReady).toBe(true);
    expect(created.phone).toBe('+91 98000 11111');
    expect(created.applicationId).toBe('app-1');
    expect(created).not.toHaveProperty('verified');
  });
});

describe('seed chefs', () => {
  it('keeps public records as potential discovery data without a verified flag', () => {
    expect(seedChefs.length).toBeGreaterThan(0);
    for (const chef of seedChefs) {
      expect(chef).not.toHaveProperty('verified');
      expect(chef.applicationReady).toBe(false);
      expect(chef.status).toBe('potential');
      expect(['discovery', 'referral', 'job_board']).toContain(chef.source);
    }
  });
});
