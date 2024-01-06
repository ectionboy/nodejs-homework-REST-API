const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { HttpError, ctrlWrapper, avatarProcessing, sendEmail } = require("../helpers");

const { JWT_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const verificationToken = nanoid();

	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
		verificationToken,
	});

	const veryfyEmail = {
		to: email,
		subject: "Email verification",
		html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Confirm email address</a>`,
	};

		await sendEmail(veryfyEmail);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

const verifyEmail = async (req, res) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw HttpError(404, "User not found");
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

	res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({email});

	if (!user) {
		throw HttpError(404, "User not found");
	}
	if (user.verify) {
		throw HttpError(400, "Verification has already been passed");
	}

	const veryfyEmail = {
		to: email,
		subject: "Email verification",
		html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Confirm email address</a>`,
	};

		await sendEmail(veryfyEmail);

	res.json({
		"message": "Verification email sent"
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	const passwordCompare = await bcrypt.compare(password, user.password);

	if (!user || !passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}
	if (!user.verify) {
		throw HttpError(401, "Email not verified");
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
	if (!req.file) {
		throw HttpError(400, "File not uploaded");
	}
	const { _id } = req.user;
	const { path: tempUpload, originalname } = req.file;
	const filename = `${_id}_${originalname}`;
	const resultUpload = path.join(avatarsDir, filename);

	avatarProcessing(tempUpload, resultUpload);

	await fs.unlink(tempUpload);
	const avatarURL = path.join("avatars", filename);

	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};

module.exports = {
	register: ctrlWrapper(register),
	verifyEmail: ctrlWrapper(verifyEmail),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
	updateAvatar: ctrlWrapper(updateAvatar),
};
