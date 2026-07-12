/**
 * @jest-environment node
 */

import { POST } from './route';

describe('POST /api/matches', () => {
  it('returns 400 when playerId is missing', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ opponentName: 'Test Opponent' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 when opponentName is missing', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ playerId: 'player-1' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('creates a match and returns 201 with valid input', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ playerId: 'player-1', opponentName: 'Test Opponent' }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.playerId).toBe('player-1');
    expect(body.opponentName).toBe('Test Opponent');
    expect(body.status).toBe('in-progress');
  });
});