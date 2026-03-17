const Joi = require("joi");
const { errorResponse } = require("../utils/response");
const { TASK_STATUSES } = require("../models/Task");

// ── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(72).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(150).required(),
  description: Joi.string().max(2000).allow("").optional(),
  status: Joi.string().valid(...TASK_STATUSES).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(150).optional(),
  description: Joi.string().max(2000).allow("").optional(),
  status: Joi.string().valid(...TASK_STATUSES).optional(),
}).min(1); // at least one field required for an update

// ── Middleware factory ────────────────────────────────────────────────────────

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message.replace(/"/g, ""));
    return errorResponse(res, 422, "Validation failed", errors);
  }
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateCreateTask: validate(createTaskSchema),
  validateUpdateTask: validate(updateTaskSchema),
};