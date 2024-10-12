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

## Task 4: User Authentication

## Overview task 4

This task implements user authentication endpoints in the Files Manager API. It includes functionality for user sign-in, sign-out, and retrieving user information.

## New Endpoints

### 1. GET /connect

- **Controller**: `AuthController.getConnect`
- **Purpose**: Authenticates a user and generates an authentication token
- **Authentication**: Basic Auth (Base64 encoded email:password)
- **Response**:
  - Success (200): `{ "token": "<generated_token>" }`
  - Error (401): `{ "error": "Unauthorized" }`

### 2. GET /disconnect

- **Controller**: `AuthController.getDisconnect`
- **Purpose**: Signs out a user by invalidating their token
- **Authentication**: Requires `X-Token` header
- **Response**:
  - Success (204): No content
  - Error (401): `{ "error": "Unauthorized" }`

### 3. GET /users/me

- **Controller**: `UsersController.getMe`
- **Purpose**: Retrieves the authenticated user's information
- **Authentication**: Requires `X-Token` header
- **Response**:
  - Success (200): `{ "id": "<user_id>", "email": "<user_email>" }`
  - Error (401): `{ "error": "Unauthorized" }`

## Implementation Details for task 4

- **Token Generation**: Uses `uuidv4` to generate unique tokens
- **Token Storage**: Tokens are stored in Redis with a 24-hour expiration
- **Password Hashing**: Passwords are stored and compared using SHA1 hashing

## Usage Examples

1. Signing in:

   ```bash
   curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="
   ```

2. Retrieving user info:

   ```bash
   curl 0.0.0.0:5000/users/me -H "X-Token: <your_token>"
   ```

3. Signing out:

   ```bash
   curl 0.0.0.0:5000/disconnect -H "X-Token: <your_token>"
   ```

## Files Modified/Created task 4

- `routes/index.js`: Added new routes
- `controllers/AuthController.js`: Implemented authentication logic
- `controllers/UsersController.js`: Added `getMe` method
- `utils/db.js`: Added methods for user retrieval

## Dependencies for Task 4

- `uuid`: For generating unique tokens
- `sha1`: For password hashing

Ensure all dependencies are installed by running:

## Task 5: File Upload Endpoint

## Overview for Task 5

This task implements a new endpoint for file uploads in our Files Manager API. It allows users to upload files, create folders, and manage their file structure.

## Implementation Details for Task 5

### New Endpoint

- **POST /files**
  - Controller: `FilesController.postUpload`
  - Purpose: Create a new file or folder in the database and on disk

### Files Modified/Created for Task 5

1. `routes/index.js`: Added new route for file upload
2. `controllers/FilesController.js`: Implemented file upload logic

## Functionality

The new endpoint handles the following:

1. User authentication via token
2. File/folder creation with attributes:
   - name
   - type (folder, file, or image)
   - parentId (optional)
   - isPublic (optional)
   - data (required for file/image, Base64 encoded)
3. Input validation
4. Parent folder validation (if parentId is provided)
5. File storage on disk (for file/image types)
6. Database entry creation

## Testing and Usage Examples

```bash
[adrian@Thinkbook15 alx-files_manager]$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"c881d13f-df66-4b4f-ada1-1e7726626dd2"}

[adrian@Thinkbook15 alx-files_manager]$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: c881d13f-df66-4b4f-ada1-1e7726626dd2" -H "Content-Type: application/json" -d '{ "name": "myText.txt", "type": "fil
e", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""
{"id":"670ab14779db5b094520cf8b","userId":"670a9abf51078577bf0af2fc","name":"myText.txt","type":"file","isPublic":false,"parentId":0}

[adrian@Thinkbook15 alx-files_manager]$ ls /tmp/files_manager/
94392418-53ed-4693-b8f5-a868a2745d63

[adrian@Thinkbook15 alx-files_manager]$ cat /tmp/files_manager/94392418-53ed-4693-b8f5-a868a2745d63
Hello Webstack!

[adrian@Thinkbook15 alx-files_manager]$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: c881d13f-df66-4b4f-ada1-1e7726626dd2" -H "Content-Type: application/json" -d '{ "name": "images", "type": "folder"
 }' ; echo ""
{"id":"670ab1bc79db5b094520cf8c","userId":"670a9abf51078577bf0af2fc","name":"images","type":"folder","isPublic":false,"parentId":0}

[adrian@Thinkbook15 alx-files_manager]$ python image_upload.py image.png c881d13f-df66-4b4f-ada1-1e7726626dd2 670ab1bc79db5b094520cf8c
{'id': '670ab56202de602382f3e697', 'userId': '670a9abf51078577bf0af2fc', 'name': 'image.png', 'type': 'image', 'isPublic': True, 'parentId': '670ab1bc79db5b094520cf8c'}
[adrian@Thinkbook15 alx-files_manager]$ echo 'db.files.find()' | mongo files_manager
MongoDB shell version v3.6.23
connecting to: mongodb://127.0.0.1:27017/files_manager?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("e78020df-41b5-4740-990a-80b2a150cbf3") }
MongoDB server version: 3.6.23
{ "_id" : ObjectId("670ab14779db5b094520cf8b"), "userId" : ObjectId("670a9abf51078577bf0af2fc"), "name" : "myText.txt", "type" : "file", "isPublic" : false, "parentId" : "0", "localPath" : "/tmp/files_manager/94392418-53ed-4693-b8f5-a868a2745d63" }
{ "_id" : ObjectId("670ab1bc79db5b094520cf8c"), "userId" : ObjectId("670a9abf51078577bf0af2fc"), "name" : "images", "type" : "folder", "isPublic" : false, "parentId" : "0" }
{ "_id" : ObjectId("670ab56202de602382f3e697"), "userId" : ObjectId("670a9abf51078577bf0af2fc"), "name" : "image.png", "type" : "image", "isPublic" : true, "parentId" : ObjectId("670ab1bc79db5b094520cf8c"), "localPath" : "/tmp/files_manager/fed669e4-e16e-46e8-a591-146f2972c54d" }
bye
[adrian@Thinkbook15 alx-files_manager]$ ls /tmp/files_manager/
94392418-53ed-4693-b8f5-a868a2745d63  fed669e4-e16e-46e8-a591-146f2972c54d

# Task 6: Get and List Files

## Objective
Implement endpoints to retrieve individual file documents and list file documents with pagination and filtering options.

## New Endpoints
Two new endpoints have been added to the `routes/index.js` file:

1. `GET /files/:id` => `FilesController.getShow`
2. `GET /files` => `FilesController.getIndex`

## Implementation Details

### GET /files/:id
This endpoint retrieves a single file document based on the provided ID.

- **Authentication**: Requires a valid token in the `X-Token` header.
- **Response**:
  - `401 Unauthorized`: If the token is invalid or missing.
  - `404 Not Found`: If no file document is found for the given ID and user.
  - `200 OK`: Returns the file document if found.

### GET /files
This endpoint retrieves a list of file documents for the authenticated user, with optional filtering and pagination.

- **Authentication**: Requires a valid token in the `X-Token` header.
- **Query Parameters**:
  - `parentId` (optional): Filters files by parent folder. Defaults to '0' (root).
  - `page` (optional): Specifies the page number for pagination. Starts at 0.
- **Pagination**: Each page contains a maximum of 20 items.
- **Response**:
  - `401 Unauthorized`: If the token is invalid or missing.
  - `200 OK`: Returns an array of file documents.

## Usage Examples

1. Retrieve a specific file:
   ```bash
   curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f"
   ```

2.List all files:

  ```bash
   curl -XGET 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f"
   ```

3.List files in a specific folder:

   ```bash
   curl -XGET 0.0.0.0:5000/files?parentId=5f1e881cc7ba06511e683b23 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f"
   ```

## Implementation Files

- `routes/index.js`: Updated with new routes.
- `controllers/FilesController.js`: Implemented `getShow` and `getIndex` methods.

## Notes task 6

- The `parentId` parameter is not validated. If it doesn't match any user folder, an empty list is returned.
- Pagination is implemented using MongoDB's aggregation pipeline for efficiency.
