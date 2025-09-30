import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title, user: req.userId });
  await task.save();
  res.json(task);
});


router.put("/:id", authMiddleware, async (req, res) => {
  const { _id, ...rest } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id },
    { ...rest },
    { new: true }
  );
  console.log("task", task);
  res.json(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Task deleted" });
});

export default router;
