# koa-resource-routes

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

This plugin works by passing in an object that represents each resource and their actions.
Resources can be nested within each other.

```js
var koa = require('koa');
var resourceRoutes = require('koa-resource-routes');

var resources = {
  users: {
    index: function* () {
      // GET /users
    },
    new: function* () {
      // GET /users/new
    },
    create: function* () {
      // POST /users
    },
    show: function* (userId) {
      // GET /users/:userId
    },
    photos: {
      index: function* (userId) {
        // GET /users/:userId/photos
      },
      destroy: function* (userId, photoId) {
        // DELETE /users/:userId/photos/:photoId
      }
    }
  },
  items: {
    index: function* () {
      // GET /items
    }
  }
};

var app = koa();

// Other middleware should go here; resourceRoutes should be last

app.use(resourceRoutes(resources));

app.listen(3000);
```

For an example of how to use this plugin with the
[ES6 Module Syntax](http://www.2ality.com/2014/09/es6-modules-final.html), check out the
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
