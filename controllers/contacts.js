const { HttpError, ctrlWrapper } = require("../helpers");

const Contact = require("../models/contacts");

// getAll
const getAll = async (req, res) => {
	const { _id: owner } = req.user;

	const { page = 1, limit = 20, favorite = false } = req.query;
	const skip = (page - 1) * limit;

	const data = await Contact.find(favorite ? { owner, favorite } : { owner }, {}, { skip, limit });
	res.json(data);
};

// getById
const getById = async (req, res) => {
	const { contactId } = req.params;

	const data = await Contact.findById(contactId).exec();

	if (!data || data.owner.toString() !== req.user._id.toString()) {
		throw HttpError(404, "Not found");
	}

	res.json(data);
};

// add
const add = async (req, res) => {
	const { _id: owner } = req.user;

	const data = await Contact.create({ ...req.body, owner });

	res.status(201).json(data);
};

// remove
const remove = async (req, res) => {
	const { contactId } = req.params;

	const result = await Contact.findById(contactId).exec();
	if (result.owner.toString() !== req.user._id.toString()) {
		throw HttpError(404, "Not found");
	}

	const data = await Contact.findByIdAndDelete(contactId);

	if (!data) {
		throw HttpError(404, "Not found");
	}

	res.json({ message: "contact deleted" });
};

// update
const update = async (req, res) => {
	const { contactId } = req.params;

	const result = await Contact.findById(contactId).exec();
	if (result.owner.toString() !== req.user._id.toString()) {
		throw HttpError(404, "Not found");
	}

	const data = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
	if (!data) {
		throw HttpError(404, "Not found");
	}

	res.json(data);
};

// updateStatusContact
const updateStatusContact = async (req, res) => {
	const { contactId } = req.params;

	const result = await Contact.findById(contactId).exec();
	if (result.owner.toString() !== req.user._id.toString()) {
		throw HttpError(404, "Not found");
	}

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
