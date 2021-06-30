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

  static async authorize({ email, password }) {
    const user = await User.findByEmail(email);

    if(!user) {
      throw new Error('Invalid email or password');
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
    if(!passwordsMatch) {
      throw new Error('Invalid email or passowrd');
    }

    return user;
  }

}
