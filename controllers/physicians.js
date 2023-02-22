const { response } = require("express");

const Physician = require("../models/physician");
const Hospital = require("../models/hospital");

const getPhysicians = async (req, res = response) => {
	try {
		const physicians = await Physician.find()
			.populate("hospital", "name image")
			.populate("createdBy", "name image");

		res.json({ ok: true, physicians });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};
const createPhysician = async (req, res = response) => {
	try {
		const { hospital } = req.body;
		const createdBy = req.uid;
		const physicianExists = await Physician.findOne({
			name: req.body.name,
		});
		const validHospital = await Hospital.findById(hospital);

		if (physicianExists)
			return res.status(409).json({
				ok: false,
				msg: "The Physician's name already exists",
			});

		if (!validHospital) throw "That hospital doesn't exist";

		const physician = new Physician({ createdBy, ...req.body });

		const physicianDB = await physician.save();

		res.json({ ok: true, physicianDB });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};
const updatePhysician = (req, res = response) => {
	try {
		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};
const deletePhysician = (req, res = response) => {
	try {
		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

module.exports = {
	getPhysicians,
	updatePhysician,
	createPhysician,
	deletePhysician,
};
