
import koa from 'koa';
import request from 'supertest';
import { expect } from 'chai';

import resourceRoutes from '../src';
import * as utils from './utils';

describe('koa-resource-routes', () => {
  let app;

  beforeEach(() => {
    app = koa();
  });

  describe('basic routing', () => {

    it('can route index method', done => {
      app.use(resourceRoutes({
        events: {
          index: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/events')
        .expect(200, 'success!')
        .end(done);
    });

    it('can route create method', done => {
      app.use(resourceRoutes({
        events: {
          create: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .post('/events')
        .expect(200, 'success!')
        .end(done);
    });

    it('can route show method', done => {
      app.use(resourceRoutes({
        events: {
          show: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/events/1')
        .expect(200, 'success!')
        .end(done);
    });

    it('can route update method', done => {
      app.use(resourceRoutes({
        events: {
          update: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .put('/events/1')
        .expect(200, 'success!')
        .end(done);
    });

    it('can route destroy method', done => {
      app.use(resourceRoutes({
        events: {
          destroy: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .del('/events/1')
        .expect(200, 'success!')
        .end(done);
    });

  });

  describe('alias routing', () => {

    it('can route default method', done => {
      app.use(resourceRoutes({
        events: {
          default: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/events')
        .expect(200, 'success!')
        .end(done);
    });

    it('can route main method', done => {
      app.use(resourceRoutes({
        events: {
          main: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/events')
        .expect(200, 'success!')
        .end(done);
    });

  });

  describe('405 errors', () => {

    it('gives 405 when index is not defined but create is', done => {
      app.use(resourceRoutes({
        events: {
          create: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/events')
        .expect(405)
        .expect('Allow','POST')
        .end(done);
    });

    it('gives 405 when put is not defined but show and destroy is', done => {
      app.use(resourceRoutes({
        events: {
          show: utils.successPlaceholder,
          destroy: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .put('/events/1')
        .expect(405)
        .expect('Allow','GET,DELETE')
        .end(done);
    });

    it('gives 405 when doing DELETE on an index route', done => {
      app.use(resourceRoutes({
        events: {
          index: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .delete('/events')
        .expect(405)
        .expect('Allow','GET')
        .end(done);
    });

  });

  describe('parameters', () => {

    it('allows numbers as url params', done => {
      app.use(resourceRoutes({
        events: {
          update: utils.parameterCheck('eventsParam'),
        },
      }));
      request(app.callback())
        .put('/events/12345')
        .expect(200, 'param: 12345')
        .end(done);
    });

    it('allows strings as url params', done => {
      app.use(resourceRoutes({
        events: {
          update: utils.parameterCheck('eventsParam'),
        },
      }));
      request(app.callback())
        .put('/events/somestring')
        .expect(200, 'param: somestring')
        .end(done);
    });

    it('allows weird ascii as url params', done => {
      app.use(resourceRoutes({
        events: {
          update: utils.parameterCheck('eventsParam'),
        },
      }));
      request(app.callback())
        .put('/events/Some-STRING_!@+lol')
        .expect(200, 'param: Some-STRING_!@+lol')
        .end(done);
    });

    it('allows long strings in resource names', done => {
      let longString = Array(100).join('areallylongstring');
      app.use(resourceRoutes({
        [longString]: {
          destroy: utils.parameterCheck(`${longString}Param`),
        },
      }));
      request(app.callback())
        .delete(`/${longString}/a-random-param`)
        .expect(200, `param: a-random-param`)
        .end(done);
    });

    it('doesnt allow resource names that start with an underscore', done => {
      app.use(resourceRoutes({
        '_events': {
          index: utils.successPlaceholder,
        },
      }));
      request(app.callback())
        .get('/_events')
        .expect(404)
        .end(done);
    });

  });

  describe('errors', () => {

    it('errors when root resource has an action', () => {
      expect(() => {
        app.use(resourceRoutes({
          index: utils.successPlaceholder,
        }));
      }).to.throw('The root resource object cannot contain actions.');
    });

    it('errors when duplicate routes are defined', () => {
      expect(() => {
        app.use(resourceRoutes({
          events: {
            index: utils.successPlaceholder,
            default: utils.successPlaceholder,
          },
        }));
      }).to.throw('The following methods mean the same thing and cannot be defined in the same ' +
        'object: index, default');
    })

  });

});


