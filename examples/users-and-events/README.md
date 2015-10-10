# Example

This example demonstrates how to use `koa-resource-routes` in a modular way with the new
[ES6 Module Syntax](http://www.2ality.com/2014/09/es6-modules-final.html). It consists of users,
events, and photos in events. This example shows how to implement the following routes:

Users:

* `POST /v1/users` - Create a new user
* `GET /v1/users/:usersParam` - Return a specific user given an ID
* `PUT /v1/users/:usersParam` - Update a specific user given an ID

Events:

* `GET /v1/events` - Return a list of events
* `POST /v1/events` - Create a new event
* `GET /v1/events/:eventsParam` - Return a specific event given an ID
* `PUT /v1/events/:eventsParam` - Update a specific event given an ID
* `DELETE /v1/events/:eventsParam` - Delete a specific event given an ID

Photos:

* `POST /v1/events/:eventsParam/photos` - Create a photo for an event

# Syntax

The gist of this example is to show how you can export other modules and compose various resource
routes. To compose a resource within another resource, add the following line of code to an
already existing resource.

```js
export * as innerResource from './innerResource';

// All of your other routing methods for this resource can go in this file as well.

export function* index(next) {
  // ...
}

export function* show(next) {
  // ...
}
```

