const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateBody, authentication } = require("../../middelwares");
const schemas = require("../../schemas/users");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

// current
router.post("/current", ctrlWrapper(authentication), ctrl.getCurrent);

module.exports = router;
