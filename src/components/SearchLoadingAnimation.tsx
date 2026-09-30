const STEPS = [
  'Filtering chefs already in the roster',
  'Keeping discovery rows labelled as potential records',
  'Scoring application readiness',
];

export function SearchLoadingAnimation() {
  return (
    <div className="loading" role="status" data-testid="search-loading">
      <div className="loading-mark" aria-hidden="true" />
      <div>
        <strong>Updating the roster</strong>
        <ul>
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
