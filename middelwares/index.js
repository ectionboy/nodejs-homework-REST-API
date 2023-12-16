const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateBodyFavorite = require("./validateBodyFavorite");
const authentication = require("./authenticate")

module.exports = {
    validateBody,
    isValidId,
    validateBodyFavorite,
    authentication,
};