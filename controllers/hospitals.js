const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitals = async (req, res = response) => {
	try {
		const hospitalExists = await Hospital.findOne({ name: req.body.name });
		if (hospitalExists)
			return res.status(409).json({
				ok: false,
				msg: "The Hospital's name already exists",
			});

		const hospitals = await Hospital.find().populate(
			"createdBy",
			"name image"
		);

		res.json({
			ok: true,
			hospitals,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpeceted Error",
		});
	}
};

const createHospital = async (req, res = response) => {
	try {
		const createdBy = req.uid;
		const hospital = new Hospital({ ...req.body, createdBy });

		const hospitalDB = await hospital.save();

		res.json({
			ok: true,
			hospitalDB,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpeceted Error",
		});
	}
};

const updateHospital = (req, res = response) => {
	try {
		res.json({
			ok: true,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpeceted Error",
		});
	}
};

const deleteHospital = (req, res = response) => {
	try {
		res.json({
			ok: true,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpeceted Error",
		});
	}
};

module.exports = {
	getHospitals,
	createHospital,
	updateHospital,
	deleteHospital,
};
