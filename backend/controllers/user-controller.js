const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const db = require("../db");
require("dotenv").config();

const generateJwt = (id, email) => {
  try {
    console.log("=== GENERATE JWT START ===");
    console.log("Parameters:", { id, email });
    console.log("Type of id:", typeof id, "Value:", id);

    if (!id) {
      console.error("WARNING: id is undefined or null!");
    }

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const decoded = jwt.decode(token);
    console.log("Decoded token after generation:", decoded);
    console.log("Token contains 'id':", "id" in decoded);

    console.log("=== GENERATE JWT END ===");

    return token;
  } catch (error) {
    console.error("Error in generateJwt:", error.message);
    throw error;
  }
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Email и пароль обязательны"));
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(ApiError.badRequest("Некорректный формат email"));
      }

      if (password.length < 6) {
        return next(
          ApiError.badRequest("Пароль должен быть не менее 6 символов"),
        );
      }

      const checkUser = await db.execute(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      if (checkUser.rows.length > 0) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует"),
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);

      console.log("Creating user...");

      const newUser = await db.execute(
        `INSERT INTO users 
        (email, password, firstname, lastname) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [email, hashPassword, firstName || "", lastName || ""],
      );

      const token = generateJwt(newUser.rows[0].user_id, newUser.rows[0].email);

      const userResponse = {
        id: newUser.rows[0].user_id,
        email: newUser.rows[0].email,
        firstName: newUser.rows[0].firstname,
        lastName: newUser.rows[0].lastname,
      };

      return res.json({
        token,
        user: userResponse,
      });
    } catch (error) {
      return next(ApiError.internal("Ошибка при регистрации"));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Email и пароль обязательны"));
      }

      const userResult = await db.execute(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const user = userResult.rows[0];

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Неверный пароль"));
      }

      const token = generateJwt(user.user_id, user.email);

      const userWithoutPassword = {
        id: user.user_id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
      };

      const decodedToken = jwt.decode(token);

      return res.json({
        token,
        user: userWithoutPassword,
        decodedToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      return next(ApiError.internal("Ошибка при входе"));
    }
  }

  async check(req, res, next) {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized("Пользователь не авторизован"));
      }

      const userResult = await db.execute(
        "SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1",
        [req.user.id],
      );

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const user = userResult.rows[0];
      const token = generateJwt(user.id, user.email);

      return res.json({ token, user });
    } catch (error) {
      return next(ApiError.internal("Ошибка при проверке авторизации"));
    }
  }

  async getUsers(req, res, next) {
    try {
      const usersResult = await db.execute(
        "SELECT id, email, first_name, last_name, created_at FROM users ORDER BY created_at DESC",
      );

      return res.json(usersResult.rows);
    } catch (error) {
      return next(ApiError.internal("Ошибка при получении пользователей"));
    }
  }

  async getOneUser(req, res, next) {
    try {
      const { id } = req.params;

      const userResult = await db.execute(
        `SELECT user_id, email, firstname, lastname
         FROM users 
         WHERE id = $1`,
        [id],
      );

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      return res.json(userResult.rows[0]);
    } catch (error) {
      return next(ApiError.internal("Ошибка при получении пользователя"));
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, email } = req.body;

      console.log(req.body);
      console.log(firstName, lastName, email, userId);

      if (!userId) {
        return next(ApiError.unauthorized("Пользователь не авторизован"));
      }

      if (firstName && firstName.length < 2) {
        return next(ApiError.badRequest("Имя должно быть не менее 2 символов"));
      }

      if (lastName && lastName.length < 2) {
        return next(
          ApiError.badRequest("Фамилия должна быть не менее 2 символов"),
        );
      }

      const updateResult = await db.execute(
        `UPDATE users 
         SET firstname = $1, 
             lastname = $2,
             email = $3
         WHERE user_id = $4
         RETURNING user_id, email, firstname, lastname`,
        [firstName, lastName, email, userId],
      );

      if (updateResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const updatedUser = updateResult.rows[0];

      const token = generateJwt(updatedUser.id, updatedUser.email);

      return res.json({
        token,
        user: updatedUser,
      });
    } catch (error) {
      return next(ApiError.internal("Ошибка при обновлении профиля"));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.user?.id;
      const { password } = req.body;

      if (!userId) {
        return next(ApiError.unauthorized("Пользователь не авторизован"));
      }

      if (!password) {
        return next(
          ApiError.badRequest("Пароль обязателен для удаления аккаунта"),
        );
      }

      const userResult = await db.execute("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const user = userResult.rows[0];

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Неверный пароль"));
      }

      await db.execute("DELETE FROM users WHERE id = $1", [userId]);

      return res.json({ message: "Аккаунт успешно удален" });
    } catch (error) {
      return next(ApiError.internal("Ошибка при удалении пользователя"));
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(ApiError.unauthorized("Пользователь не авторизован"));
      }

      const userResult = await db.execute(
        `SELECT id, email, first_name, last_name, created_at, updated_at 
         FROM users 
         WHERE id = $1`,
        [userId],
      );

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      return res.json(userResult.rows[0]);
    } catch (error) {
      return next(ApiError.internal("Ошибка при получении профиля"));
    }
  }
}

module.exports = new UserController();
