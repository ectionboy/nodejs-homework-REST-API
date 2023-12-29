const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { HttpError, ctrlWrapper } = require("../helpers");

const { JWT_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
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

const subscriptionUpdate = async (req, res) => {
	const { _id } = req.user;
	const { subscription } = req.body;
	const data = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
	res.json({
		subscription: data.subscription,
	});
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: tempUpload, originalname } = req.file;

	const resultUpload = path.join(avatarsDir, originalname);
	await fs.rename(tempUpload, resultUpload);
	const avatarURL = path.join("avatars", originalname);

	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
	updateAvatar: ctrlWrapper(updateAvatar),
};
