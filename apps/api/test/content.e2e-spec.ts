import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('content (read)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterAll(async () => app.close());

  const lists: Array<[string, number]> = [
    ['/services', 6], ['/case-studies', 9], ['/posts', 6], ['/team', 6],
    ['/jobs', 4], ['/pricing', 3], ['/faq', 8], ['/testimonials', 5],
  ];
  it.each(lists)('GET %s returns %i items', async (path, count) => {
    const res = await request(app.getHttpServer()).get(path).expect(200);
    expect(res.body).toHaveLength(count);
  });

  it('GET /services/:slug returns one service', async () => {
    const res = await request(app.getHttpServer()).get('/services/cloud-architecture').expect(200);
    expect(res.body.title).toBe('Cloud Architecture');
  });

  it('GET /services/unknown returns 404', () =>
    request(app.getHttpServer()).get('/services/nope').expect(404));

  it('pricing features decodes to array', async () => {
    const res = await request(app.getHttpServer()).get('/pricing').expect(200);
    expect(Array.isArray(res.body[0].features)).toBe(true);
  });
});
