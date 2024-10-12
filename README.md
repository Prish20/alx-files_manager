# Task 0: Redis Utils

This module provides a RedisClient class for interacting with a Redis datastore. It includes methods to check the connection status, and to perform basic CRUD operations on Redis keys.

## Features

### Connection Handling

- Automatically connects to the Redis server.
- Logs any connection errors to the console.

### Method: `isAlive()`

- Checks if the Redis server connection is active.
- Returns: `true`if connected, `false` otherwise.

### Method: `async get(key)`

- Retrieves the value associated with the specified`key`.

  - **Parameters**
    - `key` (string): The key to retrieve.
- **Returns:** The value of the key, or `null` if not found.

### Method: `async set(key, value, duration)`

- Stores a `key` with the specified `value` and sets it to expire after `duration` seconds.
  - **Parameters**
    - `key` (string): The key to store.
    - `value` (string): The value to store.
    - `duration` (number): The number of seconds to expire the key after.
  - **Returns:** `undefined`

### Method: async del(key)

- **Deletes** the specified key from Redis.
  - **Parameters**
    - `key` (string): The key to delete.
- **Returns:** `undefined`

## Task 1: MongoDB Utility

## Description

This task implements a MongoDB utility class (`DBClient`) for a file management system. It provides basic database operations and connection management.

## MongoDB Features

- Establishes connection to MongoDB
- Checks database connection status
- Counts documents in users and files collections

## Task 2: Express Server and API Endpoints

## Overview

This task involves setting up an Express server and implementing two API endpoints. The server listens on a specified port and uses routes defined in separate files. Two endpoints are implemented: one for checking the status of Redis and the database, and another for retrieving statistics about users and files.

## Files Created/Modified

1. `server.js`: Main server file
2. `routes/index.js`: Route definitions
3. `controllers/AppController.js`: Controller with endpoint implementations

## Implementation Details for Task 2

### server.js

- Creates an Express server
- Listens on the port specified by the `PORT` environment variable (default: 5000)
- Loads routes from `routes/index.js`

### routes/index.js

Defines two routes:

- `GET /status`: Maps to `AppController.getStatus`
- `GET /stats`: Maps to `AppController.getStats`

### controllers/AppController.js

Implements two methods:

1. `getStatus`:
   - Checks if Redis and the database are alive
   - Returns: `{ "redis": true, "db": true }` with status code 200

2. `getStats`:
   - Retrieves the number of users and files from the database
   - Returns: `{ "users": 12, "files": 1231 }` with status code 200

## Usage

1. Start the server:

   ```Nodejs
   npm run start-server
   ```

2. Test the endpoints:

   ```bash
   curl 0.0.0.0:5000/status
   curl 0.0.0.0:5000/stats
   ```

## Dependencies

- Express.js
- Redis client (from utils/redis.js)
- Database client (from utils/db.js)

## Notes

- Ensure that the Redis and database utilities (`utils/redis.js` and `utils/db.js`) are properly implemented with the required methods (`isAlive`, `nbUsers`, `nbFiles`).
- The server uses JSON for request and response bodies.

## Task 3: User Creation

## Objective

Implement a new endpoint to create users in the database.

## Files Modified/Created

- `routes/index.js`
- `controllers/UsersController.js`

## Implementation Details

### 1. Route Addition (`routes/index.js`)

Added a new POST route for user creation:

```javascript
router.post('/users', UsersController.postNew);
```

### 2. User Controller (`controllers/UsersController.js`)

Created a new controller with the following functionality:

- Endpoint: `POST /users`
- Purpose: Create a new user in the database
- Request body requirements:
  - `email`: User's email address
  - `password`: User's password
- Error handling:
  - Returns 400 status code if email is missing
  - Returns 400 status code if password is missing
  - Returns 400 status code if email already exists in the database
- Password security:
  - Passwords are hashed using SHA1 before storage
- Success response:
  - Returns 201 status code
  - Returns JSON object with user's id and email

## Usage Example

```bash
curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }'
```

Expected successful response:

```json
{"id":"5f1e7d35c7ba06511e683b21","email":"bob@dylan.com"}
```

## Database Impact

- New users are stored in the `users` collection
- User document structure:

  ```json
  {
    "_id": ObjectId("..."),
    "email": "user@example.com",
    "password": "hashed_password_using_sha1"
  }
  ```

## Error Responses

- Missing email: `{"error":"Missing email"}`
- Missing password: `{"error":"Missing password"}`
- Email already exists: `{"error":"Already exist"}`

## Additional Notes

- Ensure that the MongoDB connection is properly set up in `utils/db.js`
- The `sha1` package is required for password hashing

## Verification

You can verify the functionality using the following commands:

```bash
[adrian@Thinkbook15 alx-files_manager]$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }' ; echo ""
{"id":"670a9abf51078577bf0af2fc","email":"bob@dylan.com"}
[adrian@Thinkbook15 alx-files_manager]$ echo 'db.users.find()' | mongo files_manager
MongoDB shell version v3.6.23
connecting to: mongodb://127.0.0.1:27017/files_manager?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("3fd206aa-b6c6-4f0f-a2d3-1ebb38cdc296") }
MongoDB server version: 3.6.23
{ "_id" : ObjectId("670a9abf51078577bf0af2fc"), "email" : "bob@dylan.com", "password" : "89cad29e3ebc1035b29b1478a8e70854f25fa2b2" }
bye
[adrian@Thinkbook15 alx-files_manager]$  curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }' ; echo ""
{"error":"Already exist"}
[adrian@Thinkbook15 alx-files_manager]$  curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com" }' ; echo ""
{"error":"Missing password"}
{"error":"Missing password"}
bash: {error:Missing password}: command not found 
```

These commands demonstrate successful user creation, database storage, error handling for existing users, and error handling for missing password.
