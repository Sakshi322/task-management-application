const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/encryption");

const TASK_STATUSES = ["pending", "in-progress", "completed"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 1,
      maxlength: 150,
    },
    // description is stored AES-encrypted in the database
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index: powers both authorization + status filter in one query
taskSchema.index({ userId: 1, status: 1 });

// Text index for title search
taskSchema.index({ title: "text" });

// Encrypt description before saving
taskSchema.pre("save", function (next) {
  if (this.isModified("description") && this.description) {
    this.description = encrypt(this.description);
  }
  next();
});

// Encrypt on update operations (findOneAndUpdate etc.)
taskSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.description) {
    update.description = encrypt(update.description);
  }
  next();
});

// Decrypt description when reading
taskSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  obj.description = decrypt(obj.description);
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Task", taskSchema);
module.exports.TASK_STATUSES = TASK_STATUSES;