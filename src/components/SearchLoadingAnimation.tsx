const STEPS = [
  'Reading public discovery sources',
  'Keeping those rows labelled as potential records',
  'Preparing application-readiness scoring',
];

export function SearchLoadingAnimation() {
  return (
    <div className="loading" role="status" data-testid="search-loading">
      <div className="loading-mark" aria-hidden="true" />
      <div>
        <strong>Structuring the search</strong>
        <ul>
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
