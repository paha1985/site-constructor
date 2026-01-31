//src/db/index.js

const db = require("../config/database");

// Утилитарные функции для работы с базой
module.exports = {
  // Получить одну запись
  async getOne(query, params = []) {
    const result = await db.query(query, params);
    return result.rows[0] || null;
  },

  // Получить все записи
  async getAll(query, params = []) {
    const result = await db.query(query, params);
    return result.rows;
  },

  // Выполнить запрос
  async execute(query, params = []) {
    const result = await db.query(query, params);
    return result;
  },

  // Транзакция
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

  // Получить следующий ID для нумерации
  async getNextSequence(sequenceName) {
    const result = await db.query(`SELECT nextval($1) as next_id`, [
      sequenceName,
    ]);
    return result.rows[0].next_id;
  },

  // Проверить существование записи
  async exists(table, column, value) {
    const result = await db.query(
      `SELECT 1 FROM ${table} WHERE ${column} = $1 LIMIT 1`,
      [value]
    );
    return result.rows.length > 0;
  },
};
