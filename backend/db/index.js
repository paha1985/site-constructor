const db = require("../config/database");

module.exports = {
  async getOne(query, params = []) {
    const result = await db.query(query, params);
    return result.rows[0] || null;
  },

  async getAll(query, params = []) {
    const result = await db.query(query, params);
    return result.rows;
  },

  async execute(query, params = []) {
    const result = await db.query(query, params);
    return result;
  },

  async transaction(callback) {
    const client = await db.getClient();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getNextSequence(sequenceName) {
    const result = await db.query(`SELECT nextval($1) as next_id`, [
      sequenceName,
    ]);
    return result.rows[0].next_id;
  },

  async exists(table, column, value) {
    const result = await db.query(
      `SELECT 1 FROM ${table} WHERE ${column} = $1 LIMIT 1`,
      [value],
    );
    return result.rows.length > 0;
  },
};
