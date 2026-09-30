interface DashboardStatsProps {
  discoveryCount: number;
  applicationReadyCount: number;
  requirementCount: number;
  pipelineCount: number;
}

export function DashboardStats({
  discoveryCount,
  applicationReadyCount,
  requirementCount,
  pipelineCount,
}: DashboardStatsProps) {
  const stats = [
    { label: 'Discovery records', value: discoveryCount, testId: 'stat-discovery' },
    { label: 'Application-ready talent', value: applicationReadyCount, testId: 'stat-application-ready' },
    { label: 'Open requirements', value: requirementCount, testId: 'stat-requirements' },
    { label: 'In pipeline', value: pipelineCount, testId: 'stat-pipeline' },
  ];

  return (
    <section className="stats" aria-label="Hiring snapshot">
      {stats.map((stat) => (
        <article key={stat.testId} className="stat" data-testid={stat.testId}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}
