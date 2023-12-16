const Joi = require("joi");

const registerSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
	subscription: Joi.boolean(),
});
const loginSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
});

const schemas = {
    registerSchema,
    loginSchema,
}

module.exports = schemas;
