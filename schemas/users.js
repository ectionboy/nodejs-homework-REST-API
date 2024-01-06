const Joi = require("joi");

const registerSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
	subscription: Joi.string().valid("starter", "pro", "business"),
});
const loginSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
});
const subscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business"),
});

const resendVerifyEmailSchema = Joi.object({
	email: Joi.string().required(),
});

const schemas = {
	registerSchema,
	loginSchema,
	subscriptionSchema,
	resendVerifyEmailSchema,
};

module.exports = schemas;
