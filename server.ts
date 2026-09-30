import express from 'express';
import { pathToFileURL } from 'node:url';
import type { ChefCandidate, JobRequirement } from './src/types';
import { scoreMatch } from './src/utils/aiScoringEngine';

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    policy: 'application-first',
    phoneVerification: false,
  });
});

/**
 * Match score for one candidate against an optional restaurant requirement.
 * The payload may include a phone number; scoring does not use it.
 */
app.post('/api/match', (req, res) => {
  const candidate = req.body?.candidate as ChefCandidate | undefined;
  const requirement = (req.body?.requirement ?? null) as JobRequirement | null;
  if (!candidate || typeof candidate !== 'object' || typeof candidate.name !== 'string') {
    res.status(400).json({ error: 'A candidate object is required.' });
    return;
  }

  const breakdown = scoreMatch(
    {
      ...candidate,
      cuisine: Array.isArray(candidate.cuisine) ? candidate.cuisine : [],
      skills: Array.isArray(candidate.skills) ? candidate.skills : [],
      applicationReady: Boolean(candidate.applicationReady),
    },
    requirement,
  );

  res.json({
    score: breakdown.score,
    factors: breakdown.factors,
    applicationReady: Boolean(candidate.applicationReady),
    source: candidate.source ?? 'discovery',
  });
});

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  const port = Number(process.env.PORT) || 8787;
  app.listen(port, () => {
    console.log(`ChefFinder API listening on ${port}`);
  });
}

export default app;
