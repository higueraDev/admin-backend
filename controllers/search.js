const { response } = require("express");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Physician = require("../models/physician");

const search = async (req, res = response) => {
	try {
		const { query } = req.params;

		const regex = new RegExp(query, "i");

		const [usersDB, hospitalsDB, physiciansDB] = await Promise.all([
			User.find({ name: regex }),
			Hospital.find({ name: regex }),
			Physician.find({ name: regex }),
		]);

		res.json({
			ok: true,
			usersDB,
			hospitalsDB,
			physiciansDB,
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
	search,
};
