const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { googleValidation } = require("../helpers/googleValidation");
const { generateJWT } = require("../helpers/jwt");
const User = require("../models/user");

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const userDB = await User.findOne({ email });
		const passwordDB = userDB?.password || "";
		const validPassword = bcryptjs.compareSync(password, passwordDB);
		const loginValid = userDB && validPassword;

		if (!loginValid)
			return res.status(400).json({
				ok: false,
				msg: "Incorrect Credentials",
			});

		const token = await generateJWT(userDB._id);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

const googleSignin = async (req, res = response) => {
	try {
		const { email, name, picture } = await googleValidation(req.body.token);

		if (!email) throw "Invalid Google Token";

		const userDB = await User.findOne({ email });

		let user;

		if (!userDB)
			user = new User({
				name,
				email,
				image: picture,
				password: "###",
			});
		else user = userDB;

		user.google = true;
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
			msg: "Unexpected Error",
		});
	}
};

const updateToken = async (req, res = response) => {
	try {
		const { uid } = req;
		const token = await generateJWT(uid);

		res.json({
			ok: true,
			token,
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
	login,
	googleSignin,
	updateToken
};
