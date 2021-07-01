import pool from '../utils/pool.js';

export default class Comment{
  id;
  commentBy;
  postId;
  comment;

  constructor(row) {
    this.id = row.id;
    this.commentBy = row.comment_by;
    this.postId = row.post_id;
    this.comment = row.comment;
  }

  static async insert({ commentBy, postId, comment }) {
    
    const { rows } = await pool.query(
      `INSERT INTO comments
      (comment_by, post_id, comment)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [commentBy, postId, comment]
    );

    return new Comment(rows[0]);
  }
}
