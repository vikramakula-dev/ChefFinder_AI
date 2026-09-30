import type { AppView } from '../types';

interface NavbarProps {
  view: AppView;
  onView: (view: AppView) => void;
  onOpenSettings: () => void;
}

const LINKS: { id: AppView; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'applications', label: 'Applications' },
  { id: 'pipeline', label: 'Pipeline' },
];

export function Navbar({ view, onView, onOpenSettings }: NavbarProps) {
  return (
    <header className="nav">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">CF</span>
        <div>
          <strong>ChefFinder</strong>
          <em>Application-first hiring</em>
        </div>
      </div>
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className={view === link.id ? 'nav-link active' : 'nav-link'}
            aria-current={view === link.id ? 'page' : undefined}
            data-testid={`nav-${link.id}`}
            onClick={() => onView(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <button type="button" className="button ghost" onClick={onOpenSettings}>
        Settings
      </button>
    </header>
  );
}
