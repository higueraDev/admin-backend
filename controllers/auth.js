const bcryptjs = require("bcryptjs");
const { response } = require("express");
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

module.exports = login;
