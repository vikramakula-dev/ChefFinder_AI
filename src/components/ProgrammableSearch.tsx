import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CSE_ID, GOOGLE_CSE_URL } from '../config';

type SearchStatus = 'loading' | 'ready' | 'error';

function renderSearchElement(host: HTMLDivElement): boolean {
  const element = window.google?.search?.cse?.element;
  if (!element) return false;
  host.replaceChildren();
  element.render({ div: host, tag: 'search' });
  return true;
}

export function ProgrammableSearch() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SearchStatus>('loading');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let ready = false;
    const render = () => {
      if (ready || !hostRef.current) return;
      if (!renderSearchElement(hostRef.current)) return;
      ready = true;
      setStatus('ready');
    };

    render();
    window.addEventListener('cheffinder-cse-ready', render);
    const timeout = window.setTimeout(() => {
      if (!ready) setStatus('error');
    }, 8000);

    return () => {
      window.removeEventListener('cheffinder-cse-ready', render);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="filters gcse-panel" aria-label="ChefFinder Search">
      <div className="filters-head">
        <h2>ChefFinder Search</h2>
        <p>
          Web results from Programmable Search Engine <code>{GOOGLE_CSE_ID}</code> are potential discovery pages. A chef becomes a structured candidate after they submit an application.
        </p>
      </div>
      {status === 'loading' && <p className="fine">Loading the search box…</p>}
      {status === 'error' && (
        <p className="form-error" role="alert">
          The search box did not load. Use the <a href={GOOGLE_CSE_URL}>public ChefFinder Search page</a>.
        </p>
      )}
      <div ref={hostRef} className="gcse-search" data-testid="gcse-search" />
    </section>
  );
}
