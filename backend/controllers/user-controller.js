const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const db = require("../db");
require("dotenv").config();

const generateJwt = (id, email) => {
  try {
    console.log("=== GENERATE JWT START ===");
    console.log("Parameters:", { id, email });
    console.log("SECRET_KEY exists:", !!process.env.JWT_SECRET);
    console.log("SECRET_KEY length:", process.env.JWT_SECRET?.length);

    if (!process.env.JWT_SECRET) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("Token generated successfully");
    console.log("Token length:", token.length);
    console.log("=== GENERATE JWT END ===");

    return token;
  } catch (error) {
    console.error("Error in generateJwt:", error.message);
    console.error("Full error:", error);
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

      console.log("New user created:", newUser.rows[0]);

      console.log("Generating token...");

      const token = generateJwt(newUser.rows[0].user_id, newUser.rows[0].email);
      console.log("Token generated:", token);

      const userResponse = {
        id: newUser.rows[0].user_id,
        email: newUser.rows[0].email,
        firstName: newUser.rows[0].firstname,
        lastName: newUser.rows[0].lastname,
      };

      console.log("Sending response...");
      console.log("=== REGISTRATION END ===");

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

      const token = generateJwt(user.id, user.email);

      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        firstName: user.firstname, // Используем camelCase для фронтенда
        lastName: user.lastname, // Используем camelCase для фронтенда
      };

      // Декодируем токен для отправки на фронтенд
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
        `SELECT id, email, first_name, last_name, created_at 
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
      const { firstName, lastName } = req.body;

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
         SET first_name = COALESCE($1, first_name), 
             last_name = COALESCE($2, last_name),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, email, first_name, last_name, created_at, updated_at`,
        [firstName, lastName, userId],
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

  async updateEmail(req, res, next) {
    try {
      const userId = req.user?.id;
      const { email, password } = req.body;

      if (!userId) {
        return next(ApiError.unauthorized("Пользователь не авторизован"));
      }

      if (!email || !password) {
        return next(ApiError.badRequest("Email и пароль обязательны"));
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(ApiError.badRequest("Некорректный формат email"));
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

      const emailCheckResult = await db.execute(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId],
      );

      if (emailCheckResult.rows.length > 0) {
        return next(
          ApiError.badRequest("Этот email уже занят другим пользователем"),
        );
      }

      // Обновляем email
      const updateResult = await db.execute(
        `UPDATE users 
         SET email = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, email, first_name, last_name, created_at, updated_at`,
        [email, userId],
      );

      const updatedUser = updateResult.rows[0];
      const token = generateJwt(updatedUser.id, updatedUser.email);

      return res.json({
        token,
        user: updatedUser,
      });
    } catch (error) {
      return next(ApiError.internal("Ошибка при обновлении email"));
    }
  }

  // Удаление пользователя
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

      // Получаем пользователя для проверки пароля
      const userResult = await db.execute("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (userResult.rows.length === 0) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const user = userResult.rows[0];

      // Проверяем пароль
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Неверный пароль"));
      }

      // Удаляем пользователя
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
