import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('auth', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterAll(async () => app.close());

  it('login with seeded credentials returns token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL ?? 'admin@metaxia.io', password: process.env.ADMIN_PASSWORD ?? 'metaxia-admin-dev' })
      .expect(200);
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('login with wrong password returns 401', () =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@metaxia.io', password: 'wrong' })
      .expect(401));
});
