import koa from 'koa';
import resourceRoutes from 'koa-resource-routes';
import resources from './resources';

let app = koa();

// This will make sure all our resource routes start with /v1
app.use(resourceRoutes(resources, '/v1'));

app.listen(3000);
