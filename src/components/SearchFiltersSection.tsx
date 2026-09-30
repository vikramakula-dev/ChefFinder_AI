import type { FormEvent } from 'react';
import type { SearchFilters } from '../types';

interface SearchFiltersSectionProps {
  filters: SearchFilters;
  roles: string[];
  cuisines: string[];
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export function SearchFiltersSection({
  filters,
  roles,
  cuisines,
  onChange,
  onSearch,
}: SearchFiltersSectionProps) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="filters" onSubmit={submit}>
      <div className="filters-head">
        <h2>Roster filters</h2>
        <p>
          These filters apply to chefs already in ChefFinder. Web hits stay in ChefFinder Search until someone submits an application.
        </p>
      </div>
      <div className="filters-grid">
        <label>
          Filter roster
          <input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Name, cuisine, city, skill"
          />
        </label>
        <label>
          Role
          <select
            value={filters.role}
            onChange={(event) => onChange({ ...filters, role: event.target.value })}
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        <label>
          Cuisine
          <select
            value={filters.cuisine}
            onChange={(event) => onChange({ ...filters, cuisine: event.target.value })}
          >
            <option value="all">All cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </label>
        <label>
          Location contains
          <input
            value={filters.location}
            onChange={(event) => onChange({ ...filters, location: event.target.value })}
            placeholder="Hyderabad"
          />
        </label>
      </div>
      <div className="filters-actions">
        <label className="check">
          <input
            type="checkbox"
            checked={filters.applicationReadyOnly}
            onChange={(event) => onChange({ ...filters, applicationReadyOnly: event.target.checked })}
          />
          Application-ready only
        </label>
        <button type="submit" className="button" data-testid="search-button">
          Filter roster
        </button>
      </div>
    </form>
  );
}
