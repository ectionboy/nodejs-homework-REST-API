const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, validateBodyFavorite } = require("../../middelwares");
const schemas = require("../../schemas/contacts");

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.contactSchemaReq), ctrl.add);

router.delete("/:contactId", isValidId, ctrl.remove);

router.put("/:contactId", isValidId, validateBody(schemas.contactSchema), ctrl.update);

router.patch("/:contactId/favorite", isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);


module.exports = router;
