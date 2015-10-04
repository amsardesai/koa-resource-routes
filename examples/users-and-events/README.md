# Example

This example is a simple API server with a RESTful interface for users and events, where events contain photos. It has the following routes:

* `GET /v1/users/:userId` - Return a specific user given an ID
* `POST /v1/users` - Create a new user
* `PUT /v1/users` - Update a user
* `GET /v1/events` - Return a list of events
* `GET /v1/events/:eventId` - Return a specific event given an ID
* `POST /v1/events` - Create a new event
* `PUT /v1/events` - Update an event
* `DELETE /v1/events/:eventId` - Delete an event
* `POST /v1/events/:eventId/photos` - Create a photo for an event
