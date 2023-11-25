const express = require("express");
const router = express.Router();

const taskController = require("../controller/taskController");

router.get("/", taskController.read);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);

module.exports = router;
