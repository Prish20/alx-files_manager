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
