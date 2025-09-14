import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let supertest: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    supertest = request(app.getHttpServer()) as request.SuperTest<request.Test>;
  });

  it('/ (GET)', async () => {
    await supertest.get('/').expect(200).expect('Hello World!');
  });
});
