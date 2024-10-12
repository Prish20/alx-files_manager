import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * AuthController class handles authentication-related operations.
 */
class AuthController {
  /**
   * Handles user authentication and generates a token.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with token or error message
   */
  static async getConnect(req, res) {
    /** Check if Authorization header is present and starts with 'Basic ' */
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /** Decode and extract email and password from the Authorization header */
    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');
    const [email, password] = credentials;

    /** Retrieve user from database and verify credentials */
    const user = await dbClient.getUserByEmail(email);
    if (!user || user.password !== sha1(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /** Generate a new token and store it in Redis with user ID */
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

    /** Return the generated token */
    return res.status(200).json({ token });
  }

  /**
   * Handles user disconnection by invalidating the token.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Empty response with appropriate status code
   */
  static async getDisconnect(req, res) {
    /** Check if X-Token header is present */
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /** Verify if the token exists in Redis */
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /** Delete the token from Redis */
    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
