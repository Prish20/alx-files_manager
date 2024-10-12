import redis from 'redis';
import { promisify } from 'util';

/**
 * RedisClient class for managing Redis operations.
 * This class provides a wrapper around the redis client with promisified methods.
 */
class RedisClient {
  /**
   * Initializes a new instance of the RedisClient.
   * Sets up the Redis connection and promisifies key methods.
   */
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
      this._connected = false;
    });

    this.client.on('connect', () => {
      this._connected = true;
    });

    this._connected = true;
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Checks if the Redis client is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this._connected;
  }

  /**
   * Retrieves a value from Redis by key.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} The value associated with the key, or null if not found.
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {string} value - The value to store.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await this.setexAsync(key, duration, value);
  }

  /**
   * Deletes a key-value pair from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    await this.delAsync(key);
  }
}

/**
 * Singleton instance of the RedisClient.
 * Use this for all Redis operations throughout the application.
 */
const redisClient = new RedisClient();
export default redisClient;
