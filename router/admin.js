const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/admin");

router.get("/", admin_controller.renderAdmin);

router.put("/editarestados", admin_controller.editarEstados);

module.exports = router;
