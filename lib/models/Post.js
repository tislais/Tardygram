import pool from '../utils/pool.js';

export default class Post{
  id;
  userId;
  photoUrl;
  caption;
  tags;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async insert({ userId, photoUrl, caption, tags }) {
    const { rows } = await pool.query(
      `INSERT INTO posts 
      (user_id, photo_url, caption, tags) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [userId, photoUrl, caption, tags]
    );
    return new Post(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map(row => new Post(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(`
      SELECT * FROM posts 
      JOIN comments
      ON comments.post_id = posts.id
      WHERE posts.id = $1`, [id]
    );    
    
    if (!rows[0]) return null;
    const post = new Post(rows[0]);
    const comments = rows.map(row => row.comment);
    post.comments = comments;

    return post;
  }

  static async patch(post, id) {
    const { rows } = await pool.query(
      `UPDATE posts
      SET caption = $1
      WHERE id = $2
      RETURNING *`,
      [post.caption, id]
    );

    return new Post(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM posts
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    return new Post(rows[0]);
  }

  static async getPopular() {
    const { rows } = await pool.query(`
      SELECT posts.*, COUNT(comments.comment)
      FROM comments
      INNER JOIN posts
      ON posts.id = comments.post_id
      GROUP BY posts.id
      ORDER BY count DESC
      LIMIT 10
      `);

    return rows.map(row => new Post(row));
  }

}
