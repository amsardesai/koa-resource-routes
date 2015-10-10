
import koa from 'koa';
import request from 'supertest';
import { expect } from 'chai';

import resourceRoutes from '../src';

// Message to return as success
const SUCCESS = 'Successful!';

// Placeholder middleware
function* placeholderMiddleware(next) {
  this.body = SUCCESS;
  yield* next;
}

describe('koa-resource-routes', () => {
  let app;

  beforeEach(() => {
    app = koa();
  });

  describe('basic routing', () => {

    it('can route index method', done => {
      app.use(resourceRoutes({
        events: {
          index: placeholderMiddleware,
        },
      }));
      request(app.callback())
        .get('/events')
        .expect(200, SUCCESS)
        .end(done);
    });

    it('can route create method', done => {
      app.use(resourceRoutes({
        events: {
          create: placeholderMiddleware,
        },
      }));
      request(app.callback())
        .post('/events')
        .expect(200, SUCCESS)
        .end(done);
    });

    it('can route show method', done => {
      app.use(resourceRoutes({
        events: {
          show: placeholderMiddleware,
        },
      }));
      request(app.callback())
        .get('/events/1')
        .expect(200, SUCCESS)
        .end(done);
    });

    it('can route update method', done => {
      app.use(resourceRoutes({
        events: {
          update: placeholderMiddleware,
        },
      }));
      request(app.callback())
        .put('/events/1')
        .expect(200, SUCCESS)
        .end(done);
    });

    it('can route destroy method', done => {
      app.use(resourceRoutes({
        events: {
          destroy: placeholderMiddleware,
        },
      }));
      request(app.callback())
        .del('/events/1')
        .expect(200, SUCCESS)
        .end(done);
    });




  });












});


