const { HttpError, ctrlWrapper } = require("../helpers");

const fn = require("../models/contacts");

const getAll = async (req, res) => {
	const data = await fn.listContacts();
	res.json(data);
};
const getById = async (req, res) => {
	const { contactId } = req.params;
	const data = await fn.getContactById(contactId);
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json(data);
};
const add = async (req, res) => {
	const data = await fn.addContact(req.body);
	res.status(201).json(data);
};
const remove = async (req, res) => {
	const { contactId } = req.params;
	const data = await fn.removeContact(contactId);
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json({ message: "contact deleted" });
};
const update = async (req, res) => {
	const { contactId } = req.params;
	const data = await fn.updateContact(contactId, req.body);
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json(data);
};

module.exports = {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	remove: ctrlWrapper(remove),
	update: ctrlWrapper(update),
};
