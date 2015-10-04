# koa-resource-routes

[![npm version](https://badge.fury.io/js/koa-resource-routes.svg)](http://badge.fury.io/js/koa-resource-routes)
[![Dependency Status](https://david-dm.org/amsardesai/koa-resource-routes.svg)](https://david-dm.org/amsardesai/koa-resource-routes)

A lightweight middleware for [Koa](http://koajs.com/) for Rails-style RESTful resource routing.

* Supports routing for nested resources
* Works great with [ES6 Module Syntax](http://www.2ality.com/2014/09/es6-modules-final.html)

### Rails-style Routing

| **Action** | **Route**            |
|------------|----------------------|
| index      | `GET /item`          |
| new        | `GET /item/new`      |
| create     | `POST /item`         |
| show       | `GET /item/:id`      |
| edit       | `GET /item/:id/edit` |
| update     | `PUT /item/:id`      |
| destroy    | `DELETE /item/:id`   |

## Usage

This plugin works by passing in an object that contains resources and their actions. Resources can
be nested within each other.

```js
var koa = require('koa');
var resourceRoutes = require('koa-resource-routes');

var resources = {
  users: {
    index: function* () {
      // GET /v1/users
    },
    new: function* () {
      // GET /v1/users/new
    },
    create: function* () {
      // POST /v1/users
    },
    show: function* (userId) {
      // GET /v1/users/:userId
    },
    photos: {
      index: function* (userId) {
        // GET /v1/users/:userId/photos
      },
      destroy: function* (userId, photoId) {
        // DELETE /v1/users/:userId/photos/:photoId
      }
    }
  },
  items: {
    index: function* () {
      // GET /v1/items
    }
  }
};

var app = koa();

// Other middleware should go here; resourceRoutes should be last

// Pass resources into middleware, and set URL prefix to '/v1'
app.use(resourceRoutes(resources, {
  urlPrefix: '/v1',
}));

app.listen(3000);
```

For an example of how to use this plugin with the ES6 Module Syntax, check out the
[Users and Events](./examples/users-and-events) example.

## Options

* `urlPrefix` - Prefix for all URLs

## Examples

* [Users and Events](./examples/users-and-events)

## Installation

Run the command:

    $ npm install --save koa-resource-routes

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a [new pull request](../../pull/new/master)
