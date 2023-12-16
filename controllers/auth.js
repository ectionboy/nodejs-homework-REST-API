const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const { HttpError, ctrlWrapper } = require("../helpers");

const { JWT_KEY } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });
	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};
const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	const passwordCompare = await bcrypt.compare(password, user.password);

	if (!user || !passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}
	const payload = {
		id: user._id,
	};
	const token = jwt.sign(payload, JWT_KEY, { expiresIn: "12h" });

	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token: token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const logout = async (req, res) => {
	const { _id } = req.user;

	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204).json();
};

const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;
	res.json({
		email,
		subscription,
	});
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
};
