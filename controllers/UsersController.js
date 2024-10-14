import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * Creates a new user in the database.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with user data or error message
   */
  static async postNew(req, res) {
    /** Extract email and password from request body */
    const { email, password } = req.body;

    /** Check if email is provided */
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    /** Check if password is provided */
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    /** Get the users collection from the database */
    const usersCollection = dbClient.db.collection('users');

    /** Check if a user with the given email already exists */
    const existingUser = await usersCollection.findOne({ email });

    /** If user already exists, return an error */
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    /** Hash the password using SHA1 */
    const hashedPassword = sha1(password);

    /** Insert the new user into the database */
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    const userId = result.insertedId;

    // Add job to userQueue
    userQueue.add({ userId: userId.toString() });

    return res.status(201).json({ id: userId, email });
  }

  /**
   * Retrieves user information based on the provided token.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with user data or error message
   */
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
