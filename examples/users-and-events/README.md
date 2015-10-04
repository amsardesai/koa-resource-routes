# Example

This example demonstrates how to use `koa-resource-routes` in a modular way with the new
[ES6 Module Syntax](http://www.2ality.com/2014/09/es6-modules-final.html). It consists of users,
events, and photos in events. This example shows how to implement the following routes:

Users:

* `POST /v1/users` - Create a new user
* `PUT /v1/users` - Update a user
* `GET /v1/users/:userId` - Return a specific user given an ID

Events:

* `GET /v1/events` - Return a list of events
* `POST /v1/events` - Create a new event
* `GET /v1/events/:eventId` - Return a specific event given an ID
* `PUT /v1/events/:eventId` - Update an event
* `DELETE /v1/events/:eventId` - Delete an event

Photos:

* `POST /v1/events/:eventId/photos` - Create a photo for an event
