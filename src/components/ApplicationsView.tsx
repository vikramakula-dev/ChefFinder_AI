import { useEffect, useState, type FormEvent } from 'react';
import type { ChefApplication, JobRequirement } from '../types';

interface ApplicationsViewProps {
  applications: ChefApplication[];
  requirements: JobRequirement[];
  draft: Partial<ChefApplication> | null;
  draftToken: number;
  activeRequirementId: string | null;
  onSubmitApplication: (application: ChefApplication) => void;
  onSubmitRequirement: (requirement: JobRequirement) => void;
  onSelectRequirement: (id: string) => void;
}

interface ChefFormState {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  cuisineText: string;
  experienceYears: string;
  skillsText: string;
  availability: string;
  salaryExpectation: string;
  summary: string;
}

interface JobFormState {
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  role: string;
  cuisineText: string;
  minExperience: string;
  skillsText: string;
  employmentType: string;
  salaryRange: string;
  notes: string;
}

const EMPTY_CHEF: ChefFormState = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  role: '',
  cuisineText: '',
  experienceYears: '',
  skillsText: '',
  availability: '',
  salaryExpectation: '',
  summary: '',
};

const EMPTY_JOB: JobFormState = {
  restaurantName: '',
  contactName: '',
  phone: '',
  email: '',
  location: '',
  role: '',
  cuisineText: '',
  minExperience: '',
  skillsText: '',
  employmentType: 'Full-time',
  salaryRange: '',
  notes: '',
};

function splitList(value: string): string[] {
  return value.split(',').map((part) => part.trim()).filter(Boolean);
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export function ApplicationsView({
  applications,
  requirements,
  draft,
  draftToken,
  activeRequirementId,
  onSubmitApplication,
  onSubmitRequirement,
  onSelectRequirement,
}: ApplicationsViewProps) {
  const [chef, setChef] = useState<ChefFormState>(EMPTY_CHEF);
  const [job, setJob] = useState<JobFormState>(EMPTY_JOB);
  const [chefError, setChefError] = useState('');
  const [jobError, setJobError] = useState('');
  const [chefMessage, setChefMessage] = useState('');
  const [jobMessage, setJobMessage] = useState('');

  useEffect(() => {
    if (!draft) return;
    setChef({
      ...EMPTY_CHEF,
      fullName: draft.fullName ?? '',
      phone: draft.phone ?? '',
      email: draft.email ?? '',
      location: draft.location ?? '',
      role: draft.role ?? '',
      cuisineText: (draft.cuisine ?? []).join(', '),
      experienceYears: draft.experienceYears !== undefined ? String(draft.experienceYears) : '',
      skillsText: (draft.skills ?? []).join(', '),
      summary: draft.summary ?? '',
    });
    setChefError('');
    setChefMessage('Invite started. Submit the application to create a structured candidate.');
  }, [draft, draftToken]);

  function submitChef(event: FormEvent) {
    event.preventDefault();
    const experienceYears = Number(chef.experienceYears);
    if (!chef.fullName.trim() || !chef.role.trim() || !chef.location.trim() || !Number.isFinite(experienceYears) || experienceYears < 0) {
      setChefError('Name, role, location, and years of experience are required.');
      setChefMessage('');
      return;
    }

    onSubmitApplication({
      id: crypto.randomUUID(),
      fullName: chef.fullName.trim(),
      phone: chef.phone.trim(),
      email: chef.email.trim(),
      location: chef.location.trim(),
      role: chef.role.trim(),
      cuisine: splitList(chef.cuisineText),
      experienceYears,
      skills: splitList(chef.skillsText),
      availability: chef.availability.trim(),
      salaryExpectation: chef.salaryExpectation.trim(),
      summary: chef.summary.trim(),
      submittedAt: new Date().toISOString(),
    });
    setChef(EMPTY_CHEF);
    setChefError('');
    setChefMessage('Application saved. This chef is now a structured candidate.');
  }

  function submitJob(event: FormEvent) {
    event.preventDefault();
    const minExperience = Number(job.minExperience);
    if (!job.restaurantName.trim() || !job.role.trim() || !job.location.trim() || !Number.isFinite(minExperience) || minExperience < 0) {
      setJobError('Restaurant, role, location, and minimum experience are required.');
      setJobMessage('');
      return;
    }

    onSubmitRequirement({
      id: crypto.randomUUID(),
      restaurantName: job.restaurantName.trim(),
      contactName: job.contactName.trim(),
      phone: job.phone.trim(),
      email: job.email.trim(),
      location: job.location.trim(),
      role: job.role.trim(),
      cuisine: splitList(job.cuisineText),
      minExperience,
      requiredSkills: splitList(job.skillsText),
      employmentType: job.employmentType,
      salaryRange: job.salaryRange.trim(),
      notes: job.notes.trim(),
      submittedAt: new Date().toISOString(),
    });
    setJob(EMPTY_JOB);
    setJobError('');
    setJobMessage('Requirement saved and set as the matching target.');
  }

  return (
    <div className="applications" data-testid="applications-view">
      <section className="panel">
        <div className="filters-head">
          <h2>Chef application</h2>
          <p>Submitting this form creates a structured candidate. The phone field is contact information.</p>
        </div>
        <form className="stack-form" data-testid="chef-application-form" onSubmit={submitChef}>
          <div className="form-grid">
            <label>
              Full name
              <input value={chef.fullName} onChange={(event) => setChef({ ...chef, fullName: event.target.value })} />
            </label>
            <label>
              Contact phone
              <input value={chef.phone} onChange={(event) => setChef({ ...chef, phone: event.target.value })} placeholder="Optional" />
            </label>
            <label>
              Email
              <input value={chef.email} onChange={(event) => setChef({ ...chef, email: event.target.value })} />
            </label>
            <label>
              Location
              <input value={chef.location} onChange={(event) => setChef({ ...chef, location: event.target.value })} />
            </label>
            <label>
              Role
              <input value={chef.role} onChange={(event) => setChef({ ...chef, role: event.target.value })} />
            </label>
            <label>
              Years of experience
              <input type="number" min="0" value={chef.experienceYears} onChange={(event) => setChef({ ...chef, experienceYears: event.target.value })} />
            </label>
            <label>
              Cuisines
              <input value={chef.cuisineText} onChange={(event) => setChef({ ...chef, cuisineText: event.target.value })} placeholder="Hyderabadi, North Indian" />
            </label>
            <label>
              Skills
              <input value={chef.skillsText} onChange={(event) => setChef({ ...chef, skillsText: event.target.value })} placeholder="Costing, Tandoor" />
            </label>
            <label>
              Availability
              <input value={chef.availability} onChange={(event) => setChef({ ...chef, availability: event.target.value })} />
            </label>
            <label>
              Salary expectation
              <input value={chef.salaryExpectation} onChange={(event) => setChef({ ...chef, salaryExpectation: event.target.value })} />
            </label>
          </div>
          <label>
            Application summary
            <textarea value={chef.summary} onChange={(event) => setChef({ ...chef, summary: event.target.value })} rows={3} />
          </label>
          {chefError && <p className="form-error" role="alert">{chefError}</p>}
          {chefMessage && <p className="form-ok" role="status">{chefMessage}</p>}
          <button type="submit" className="button" data-testid="submit-chef">
            Submit chef application
          </button>
        </form>
        <ul className="record-list">
          {applications.length === 0 && <li className="fine">No chef applications yet.</li>}
          {applications.map((application) => (
            <li key={application.id}>
              <strong>{application.fullName}</strong>
              <span>{application.role} · {application.location}</span>
              <span className="fine">{formatWhen(application.submittedAt)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="filters-head">
          <h2>Restaurant requirement</h2>
          <p>Submitting this form creates the structured target used for matching.</p>
        </div>
        <form className="stack-form" data-testid="requirement-form" onSubmit={submitJob}>
          <div className="form-grid">
            <label>
              Restaurant
              <input value={job.restaurantName} onChange={(event) => setJob({ ...job, restaurantName: event.target.value })} />
            </label>
            <label>
              Contact name
              <input value={job.contactName} onChange={(event) => setJob({ ...job, contactName: event.target.value })} />
            </label>
            <label>
              Contact phone
              <input value={job.phone} onChange={(event) => setJob({ ...job, phone: event.target.value })} placeholder="Optional" />
            </label>
            <label>
              Email
              <input value={job.email} onChange={(event) => setJob({ ...job, email: event.target.value })} />
            </label>
            <label>
              Location
              <input value={job.location} onChange={(event) => setJob({ ...job, location: event.target.value })} />
            </label>
            <label>
              Role
              <input value={job.role} onChange={(event) => setJob({ ...job, role: event.target.value })} />
            </label>
            <label>
              Cuisines
              <input value={job.cuisineText} onChange={(event) => setJob({ ...job, cuisineText: event.target.value })} placeholder="Hyderabadi" />
            </label>
            <label>
              Minimum experience
              <input type="number" min="0" value={job.minExperience} onChange={(event) => setJob({ ...job, minExperience: event.target.value })} />
            </label>
            <label>
              Required skills
              <input value={job.skillsText} onChange={(event) => setJob({ ...job, skillsText: event.target.value })} placeholder="Costing, Brigade leadership" />
            </label>
            <label>
              Employment type
              <select value={job.employmentType} onChange={(event) => setJob({ ...job, employmentType: event.target.value })}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Trial</option>
              </select>
            </label>
            <label>
              Salary range
              <input value={job.salaryRange} onChange={(event) => setJob({ ...job, salaryRange: event.target.value })} />
            </label>
          </div>
          <label>
            Notes
            <textarea value={job.notes} onChange={(event) => setJob({ ...job, notes: event.target.value })} rows={3} />
          </label>
          {jobError && <p className="form-error" role="alert">{jobError}</p>}
          {jobMessage && <p className="form-ok" role="status">{jobMessage}</p>}
          <button type="submit" className="button" data-testid="submit-requirement">
            Save requirement
          </button>
        </form>
        <ul className="record-list">
          {requirements.length === 0 && <li className="fine">No restaurant requirements yet.</li>}
          {requirements.map((requirement) => (
            <li key={requirement.id}>
              <strong>{requirement.restaurantName}</strong>
              <span>{requirement.role} · {requirement.location}</span>
              <button
                type="button"
                className={requirement.id === activeRequirementId ? 'button' : 'button ghost'}
                onClick={() => onSelectRequirement(requirement.id)}
                aria-pressed={requirement.id === activeRequirementId}
              >
                {requirement.id === activeRequirementId ? 'Matching target' : 'Use for matching'}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
