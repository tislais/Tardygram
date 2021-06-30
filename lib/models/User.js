import jwt from 'jsonwebtoken';
import pool from '../utils/pool.js';

export default class User {
  id;
  email;
  passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash }) {
    
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async findByEmail(email) {
    
    
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if(!rows[0]) return null;
    return new User(rows[0]);
  }

  authToken() {
    return jwt.sign({ ...this }, process.env.APP_SECRET, {
      expiresIn: '24h'
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email
    };
  }
}
