const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

// Применяем middleware для проверки, является ли пользователь администратором
router.use(authenticateAdmin);

// Маршруты для управления пользователями
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.changeUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Маршруты для управления постами
router.get("/posts", adminController.getAllPosts);
router.delete("/posts/:id", adminController.deletePost);

module.exports = router;
