const { HttpError, ctrlWrapper } = require("../helpers");

const Contact = require("../models/contacts");

const getAll = async (req, res) => {
	const {_id: owner} = req.user;
	const data = await Contact.find({owner});
	res.json(data);
};
const getById = async (req, res) => {
	const { contactId } = req.params;
	const data = await Contact.findById(contactId);
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json(data);
};
const add = async (req, res) => {
	const {_id: owner} = req.user;
	const data = await Contact.create({...req.body, owner});
	res.status(201).json(data);
};
const remove = async (req, res) => {
	const { contactId } = req.params;
	const data = await Contact.findByIdAndDelete(contactId);
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json({ message: "contact deleted" });
};
const update = async (req, res) => {
	const { contactId } = req.params;
	const data = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
	if (!data) {
		throw HttpError(404, "Not found");
	}
	res.json(data);
};
const updateStatusContact = async (req, res) => {
	const { contactId } = req.params;
	const data = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
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
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
