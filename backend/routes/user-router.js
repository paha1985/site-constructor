const Router = require("express");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

// Публичные роуты
router.post("/registration", userController.registration);
router.post("/login", userController.login);

// Защищенные роуты
router.get("/auth", authMiddleware, userController.check);
router.get("/profile", authMiddleware, userController.getProfile);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.patch("/email", authMiddleware, userController.updateEmail);
router.delete("/", authMiddleware, userController.deleteUser);

// Административные роуты (если нужно)
router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getOneUser);

module.exports = router;
