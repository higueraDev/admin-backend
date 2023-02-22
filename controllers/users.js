const User = require("../models/user");
const response = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res = response) => {
	try {
		const size = Number(req.query.size) || 0;
		const from = Number(req.query.from) || 0;

		const [users, total] = await Promise.all([
			User.find({}, "name email role google image").skip(from).limit(size),
			User.count(),
		]);

		res.json({
			ok: true,
			users,
			total,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(409).json({
				ok: false,
				msg: "The email has already been used",
			});
		}

		const user = new User(req.body);

		// password encryption
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		const userDB = await user.save();
		const token = await generateJWT(userDB.id);

		res.json({
			ok: true,
			userDB,
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Something went wrong",
		});
	}
};

const updateUser = async (req, res = response) => {

	const uid = req.params.id;

	try {
		const userDB = await User.findById(uid);

		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: "User doesn't exists",
			});
		}

		const { password, google, email, ...fields } = req.body;
		const emailChanged = userDB.email !== email;
		const userExists = await User.findOne({ email });

		if (userExists && emailChanged)
			return res.status(400).json({
				ok: false,
				msg: email + " email already taken",
			});

		const newData = { email, ...fields };

		const updatedUser = await User.findByIdAndUpdate(uid, newData, {
			new: true,
		});

		res.json({
			ok: true,
			user: updatedUser,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

const deleteUser = async (req, res = response) => {
	const uid = req.params.id;
	try {
		const userExists = await User.findById(uid);

		if (!userExists) {
			return res.status(404).json({
				ok: false,
				msg: "User doesn't exist",
			});
		}

		await User.findByIdAndDelete(uid);

		res.json({
			ok: true,
			msg: "User deleted successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

module.exports = {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
};
