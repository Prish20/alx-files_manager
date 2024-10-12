import { MongoClient, ObjectID } from 'mongodb';

/**
 * Database configuration parameters.
 * These values can be overridden by environment variables.
 * @type {string}
 */
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * DBClient - A class for managing MongoDB database operations.
 * This class provides methods for connecting to the database,
 * checking connection status, and performing basic queries.
 */
class DBClient {
  /**
   * Initializes the DBClient and establishes a connection to MongoDB.
   * Sets up the database and collection references if the connection is successful.
   * If the connection fails, it logs an error and sets the db property to null.
   */
  constructor() {
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (!err) {
        this.db = this.client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.error(err);
        this.db = false;
      }
    });
  }

  /**
   * Checks if the connection to MongoDB is alive.
   * @returns {boolean} True if the connection is alive (this.db is not null), false otherwise.
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Retrieves the number of documents in the users collection.
   * @returns {Promise<number>} A promise that resolves to the number of users in the collection.
   * @throws {Error} If the database connection is not established.
   */
  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  /**
   * Retrieves the number of documents in the files collection.
   * @returns {Promise<number>} A promise that resolves to the number of files in the collection.
   * @throws {Error} If the database connection is not established.
   */
  async nbFiles() {
    return this.filesCollection.countDocuments();
  }

  async getUserByEmail(email) {
    return this.usersCollection.findOne({ email });
  }

  async getUserById(id) {
    return this.usersCollection.findOne({ _id: ObjectID(id) });
  }
}

/**
 * Singleton instance of the DBClient class.
 * This ensures that only one database connection is used throughout the application.
 * @type {DBClient}
 */
const dbClient = new DBClient();

export default dbClient;
