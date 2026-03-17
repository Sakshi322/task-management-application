const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validate");

// All task routes are protected
router.use(protect);

router.get("/", getTasks);
router.post("/", validateCreateTask, createTask);
router.get("/:id", getTaskById);
router.put("/:id", validateUpdateTask, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;