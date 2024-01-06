const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateBody, authentication, upload } = require("../../middelwares");
const schemas = require("../../schemas/users");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// verify email
router.get("/verify/:verificationToken", ctrl.verifyEmail);

// resend verify email
router.post("/verify", validateBody(schemas.resendVerifyEmailSchema), ctrl.resendVerifyEmail);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

// logout
router.post("/logout", ctrlWrapper(authentication), ctrl.logout);

// current
router.post("/current", ctrlWrapper(authentication), ctrl.getCurrent);

// subscriptionUpdate
router.patch("/", ctrlWrapper(authentication), validateBody(schemas.subscriptionSchema), ctrl.subscriptionUpdate);

// updateAvatar
router.patch("/avatars", ctrlWrapper(authentication), upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;
