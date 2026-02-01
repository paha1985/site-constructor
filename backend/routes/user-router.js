const Router = require("express");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/profile", authMiddleware, userController.getProfile);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.delete("/", authMiddleware, userController.deleteUser);

router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getOneUser);

module.exports = router;
