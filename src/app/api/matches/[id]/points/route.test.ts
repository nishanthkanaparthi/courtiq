/**
 * @jest-environment node
 */

import { POST as createMatch } from '../../route';
import { POST as logPoint } from './route';

describe('POST /api/matches/:id/points', () => {
  it('returns 400 for an invalid winner value', async () => {
    const request = new Request('http://localhost/api/matches/123/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'nobody' }),
    });

    const response = await logPoint(request, { params: Promise.resolve({ id: '123' }) });

    expect(response.status).toBe(400);
  });

  it('returns 404 when the match does not exist', async () => {
    const request = new Request('http://localhost/api/matches/nonexistent/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await logPoint(request, { params: Promise.resolve({ id: 'nonexistent' }) });

    expect(response.status).toBe(404);
  });

  it('records a point on an existing match', async () => {
    const createRequest = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ playerId: 'player-1', opponentName: 'Test Opponent' }),
    });
    const createResponse = await createMatch(createRequest);
    const match = await createResponse.json();

    const pointRequest = new Request(`http://localhost/api/matches/${match.id}/points`, {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });
    const pointResponse = await logPoint(pointRequest, { params: Promise.resolve({ id: match.id }) });
    const updated = await pointResponse.json();

    expect(pointResponse.status).toBe(200);
    expect(updated.sets[0].games[0].score.player).toBe(15);
  });
});