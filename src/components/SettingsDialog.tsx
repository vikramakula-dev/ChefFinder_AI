import { useEffect } from 'react';
import { GOOGLE_CSE_ID, GOOGLE_CSE_URL } from '../config';

interface SettingsDialogProps {
  onClose: () => void;
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        data-testid="settings-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dialog-head">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </header>
        <section>
          <h3>Browser storage</h3>
          <p>
            Chef applications live in <code>cheffinder_chef_applications</code>. Restaurant requirements live in <code>cheffinder_job_requirements</code>.
          </p>
          <p className="fine">The next production phase replaces these keys with a PostgreSQL API.</p>
        </section>
        <section>
          <h3>Gemini</h3>
          <p>
            An optional API key can be added later for narrative match notes. Scores already run in the app from application data.
          </p>
        </section>
        <section>
          <h3>ChefFinder Search</h3>
          <p>
            Programmable Search Engine <code>{GOOGLE_CSE_ID}</code>. Web results are potential discovery pages.
          </p>
          <p className="fine">
            <a href={GOOGLE_CSE_URL}>Public search page</a>
          </p>
        </section>
      </div>
    </div>
  );
}
