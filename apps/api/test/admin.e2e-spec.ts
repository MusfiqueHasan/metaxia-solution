import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('admin crud', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL ?? 'admin@metaxia.io', password: process.env.ADMIN_PASSWORD ?? 'metaxia-admin-dev' });
    token = res.body.accessToken;
  });
  afterAll(async () => app.close());

  it('rejects unauthenticated create', () =>
    request(app.getHttpServer()).post('/admin/services').send({}).expect(401));

  it('creates, updates, deletes a service', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'test-svc', title: 'Test Svc', excerpt: 'x', body: 'y', icon: 'code', order: 99 })
      .expect(201);
    const id = created.body.id;

    await request(app.getHttpServer())
      .patch(`/admin/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Renamed Svc' })
      .expect(200);

    const fetched = await request(app.getHttpServer()).get('/services/test-svc').expect(200);
    expect(fetched.body.title).toBe('Renamed Svc');

    await request(app.getHttpServer())
      .delete(`/admin/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer()).get('/services/test-svc').expect(404);
  });

  it('creates and deletes a pricing plan with features array', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/pricing')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Temp', price: 1, period: 'per month', description: 'd', features: ['a', 'b'], highlighted: false, order: 99 })
      .expect(201);
    expect(created.body.features).toEqual(['a', 'b']);
    await request(app.getHttpServer())
      .delete(`/admin/pricing/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('404 on unknown id', () =>
    request(app.getHttpServer())
      .patch('/admin/services/nope')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' })
      .expect(404));

  it('reads contact submissions inbox', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/contact-submissions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
