const Task = require("../models/Task");
const { decrypt } = require("../utils/encryption");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/tasks?page=1&limit=10&status=pending&search=keyword
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Base filter — ALWAYS scoped to the authenticated user
    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (search && search.trim()) {
      // Text index search on title
      filter.$text = { $search: search.trim() };
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(filter),
    ]);

    // Decrypt descriptions before sending
    const safeTasks = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: decrypt(task.description),
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return successResponse(res, 200, "Tasks fetched", {
      tasks: safeTasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    return errorResponse(res, 500, "Could not fetch tasks.");
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description = "", status = "pending" } = req.body;

    const task = await Task.create({
      title,
      description, // encrypted in pre-save hook
      status,
      userId: req.user.id,
    });

    return successResponse(res, 201, "Task created", {
      task: task.toSafeJSON(),
    });
  } catch (err) {
    console.error("Create task error:", err);
    return errorResponse(res, 500, "Could not create task.");
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    // findOneAndUpdate with userId filter — prevents accessing another user's task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return errorResponse(res, 404, "Task not found.");
    }

    // Manually decrypt since findOneAndUpdate doesn't trigger toSafeJSON
    const safeTask = {
      id: task._id,
      title: task.title,
      description: decrypt(task.description),
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    return successResponse(res, 200, "Task updated", { task: safeTask });
  } catch (err) {
    if (err.name === "CastError") {
      return errorResponse(res, 400, "Invalid task ID.");
    }
    console.error("Update task error:", err);
    return errorResponse(res, 500, "Could not update task.");
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    // userId filter ensures ownership
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return errorResponse(res, 404, "Task not found.");
    }

    return successResponse(res, 200, "Task deleted");
  } catch (err) {
    if (err.name === "CastError") {
      return errorResponse(res, 400, "Invalid task ID.");
    }
    console.error("Delete task error:", err);
    return errorResponse(res, 500, "Could not delete task.");
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return errorResponse(res, 404, "Task not found.");
    }

    return successResponse(res, 200, "Task fetched", { task: task.toSafeJSON() });
  } catch (err) {
    if (err.name === "CastError") {
      return errorResponse(res, 400, "Invalid task ID.");
    }
    return errorResponse(res, 500, "Could not fetch task.");
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById };