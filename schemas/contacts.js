const Joi = require("joi");

const contactSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
	favorite: Joi.boolean,
}).min(1);
const contactSchemaReq = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
});
const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
})
module.exports = {
    contactSchema,
    contactSchemaReq,
	updateFavoriteSchema,
};