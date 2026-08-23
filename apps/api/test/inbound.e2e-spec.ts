import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('inbound', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });
  afterAll(async () => app.close());

  it('POST /contact accepts valid submission', () =>
    request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'Hello there, we need a website.' })
      .expect(201)
      .expect({ ok: true }));

  it('POST /contact rejects bad email', async () => {
    const res = await request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'X', email: 'not-an-email', message: 'hi' })
      .expect(400);
    expect(JSON.stringify(res.body.message)).toContain('email');
  });

  it('POST /contact rejects missing message', () =>
    request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'X', email: 'a@b.co' })
      .expect(400));

  it('POST /newsletter accepts and dedupes', async () => {
    await request(app.getHttpServer()).post('/newsletter').send({ email: 'dup@example.com' }).expect(201);
    await request(app.getHttpServer()).post('/newsletter').send({ email: 'dup@example.com' }).expect(201);
  });
});
