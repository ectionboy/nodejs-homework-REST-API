const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, validateBodyFavorite, authentication } = require("../../middelwares");
const schemas = require("../../schemas/contacts");

router.get("/", authentication, ctrl.getAll);

router.get("/:contactId", authentication, isValidId, ctrl.getById);

router.post("/", authentication, validateBody(schemas.contactSchemaReq), ctrl.add);

router.delete("/:contactId", authentication, isValidId, ctrl.remove);

router.put("/:contactId", authentication, isValidId, validateBody(schemas.contactSchema), ctrl.update);

router.patch("/:contactId/favorite", authentication, isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);


module.exports = router;
