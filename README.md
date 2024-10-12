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

## Implementation Details

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
