const User = require("../models/user");
const response = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res = response) => {
	try {
		const users = await User.find();
		res.json({
			ok: true,
			users: users,
			uid: req.uid
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
			return res.status(400).json({
				ok: false,
				msg: "The email has already been used",
			});
		}

		const user = new User(req.body);

		// password encryption
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();
		const token = await generateJWT(user.id);

		res.json({
			ok: true,
			user,
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
	// TODO: validation Token

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
		const userExists = User.findOne({ email });

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

deleteUser = async (req, res = response) => {
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
