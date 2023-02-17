const User = require("../models/user");
const response = require("express");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res = response) => {
	try {
		const users = await User.find();
		res.json({
			ok: true,
			users: users,
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

		res.json({
			ok: true,
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Something went wrong",
		});
	}
};

module.exports = {
	getUsers,
	createUser,
};
