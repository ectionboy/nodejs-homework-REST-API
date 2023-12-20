const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, validateBodyFavorite, authentication } = require("../../middelwares");
const schemas = require("../../schemas/contacts");
const { ctrlWrapper } = require("../../helpers");

router.get("/", ctrlWrapper(authentication), ctrl.getAll);

router.get("/:contactId", ctrlWrapper(authentication), isValidId, ctrl.getById);

router.post("/", ctrlWrapper(authentication), validateBody(schemas.contactSchemaReq), ctrl.add);

router.delete("/:contactId", ctrlWrapper(authentication), isValidId, ctrl.remove);

router.put("/:contactId", ctrlWrapper(authentication), isValidId, validateBody(schemas.contactSchema), ctrl.update);

router.patch("/:contactId/favorite", ctrlWrapper(authentication), isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);


module.exports = router;
