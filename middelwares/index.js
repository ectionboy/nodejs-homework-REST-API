const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateBodyFavorite = require("./validateBodyFavorite");
const authentication = require("./authenticate");
const upload = require("./upload");

module.exports = {
	validateBody,
	isValidId,
	validateBodyFavorite,
	authentication,
	upload,
};
