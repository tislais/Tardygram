import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    return User.insert({ email, passwordHash });
  }


}
