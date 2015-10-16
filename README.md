# koa-resource-routes

[![Build Status](https://travis-ci.org/amsardesai/koa-resource-routes.svg?branch=master)](https://travis-ci.org/amsardesai/koa-resource-routes)
[![npm version](https://badge.fury.io/js/koa-resource-routes.svg)](http://badge.fury.io/js/koa-resource-routes)
[![Dependency Status](https://david-dm.org/amsardesai/koa-resource-routes.svg)](https://david-dm.org/amsardesai/koa-resource-routes)

A lightweight middleware for [Koa](http://koajs.com/) for declarative action-based routing.

* Encourages modular RESTful routing scheme
* Actions are similar to established Rails routing conventions
* Supports routing for nested resources

### Action-based Routing

| **Action** | **Route**             | **Aliases**       |
|------------|-----------------------|-------------------|
| index      | `GET /item`           | `default`, `main` |
| create     | `POST /item`          |                   |
| show       | `GET /item/:param`    |                   |
| update     | `PUT /item/:param`    |                   |
| destroy    | `DELETE /item/:param` |                   |

## Usage

This plugin is a very lightweight layer on top of `koa-route` that allows you to organize your
*routes* based on *resources* that contain *actions*. Five fundamental resource actions are
supported:

* `index`: Returns a list of the resources.
* `create`: Creates a resource.
* `show`: Shows a specific resource.
* `update`: Updates a specific resource.
* `destroy`: Destroys a specific resource.

It all works by passing in an object that contains a structured representation of your resources
and actions. Resources can be nested within other resources.

```js
var koa = require('koa');
var mount = require('koa-mount');
var resourceRoutes = require('koa-resource-routes');

var resources = {
  users: {
    index: function* (next) {
      // GET /v1/users
    },
    create: function* (next) {
      // POST /v1/users
    },
    show: function* (next) {
      // GET /v1/users/:usersParam
    },
    photos: {
      index: function* (next) {
        // GET /v1/users/:usersParam/photos
      },
      destroy: function* (next) {
        // DELETE /v1/users/:usersParam/photos/:photosParam
      }
    }
  },
  items: {
    index: function* (next) {
      // GET /v1/items
    }
  }
};

var app = koa();

// Other middleware should go here; resourceRoutes should be last

// Pass resources into middleware, and set URL prefix to '/v1'
app.use(mount('/v1', resourceRoutes(resources)));

app.listen(3000);
```

### URL Parameters

URL parameters for a given route will be in `this.params.<resourceName>Param`. Here's an example
for a resource called `someResource`.

```js
{
  someResource: {
    show: function* (next) {
      this.body = 'Currently showing some resource with param = ' + this.params.someResourceParam;
    }
  }
}
```

Parameters are designed to be completely flexible. You have the choice of putting a numerical
identifier or a slug.

### ES6 Module Syntax

For an example of how to use this plugin with the ES6 Module Syntax, check out the
[Users and Events](./examples/users-and-events) example.

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
