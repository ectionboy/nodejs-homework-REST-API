const express = require("express");

const ctrl = require("../../controllers/auth")

const { validateBody } = require("../../middelwares");
const schemas = require("../../schemas/users");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register );

module.exports = router;
