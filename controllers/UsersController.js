import sha1 from 'sha1';
import dbClient from '../utils/db';

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

    /** Return the new user's id and email */
    return res.status(201).json({
      id: result.insertedId.toString(),
      email,
    });
  }
}

export default UsersController;
