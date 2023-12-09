const Joi = require("joi");

const registerSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
	subscription: Joi.boolean(),
});

const schemas = {
    registerSchema,
}

module.exports = schemas;
