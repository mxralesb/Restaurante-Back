const request = require('supertest');
const app = require('../src/index');

describe('API smoke tests', () => {
  it('GET /api/health -> 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /api/orders -> 201', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ product_id: 'p1', qty: 1 }],
      type: 'INTERNAL'
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('PLACED');
  });

  it('POST /api/reservations -> 201', async () => {
    const res = await request(app).post('/api/reservations').send({
      branch_id: 'b1',
      date_time: new Date().toISOString(),
      people: 4,
      customer_name: 'Cliente Demo'
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('CONFIRMED');
  });
});
