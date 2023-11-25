const express = require("express");
const router = express.Router();

const taskController = require("../controller/taskController");

router.delete("/tasks", taskController.deleteByName);

module.exports = router;
