const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitals = async (req, res = response) => {
	try {
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
		const hospitalExists = await Hospital.findOne({ name: req.body.name });
		if (hospitalExists)
			return res.status(409).json({
				ok: false,
				msg: "The Hospital's name already exists",
			});

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
			msg: "Unexpected Error",
		});
	}
};

const updateHospital = async (req, res = response) => {
	try {
		const id = req.params.id;

		const hospitalExists = await Hospital.findById(id);

		if (!hospitalExists) throw "Hospital not found";

		const { newName, image, ...body } = req.body;

		const nameHasChanged = newName !== hospitalExists.name;

		const nameExists = await Hospital.findOne({ name: newName });

		if (nameHasChanged && nameExists)
			throw "The Hospital's name already exists";

		const createdBy = req.uid;

		const changes = {
			...body,
			...newName,
			createdBy,
		};

		const updatedHospital = await Hospital.findByIdAndUpdate(id, changes, {
			new: true,
		});

		if (!updatedHospital) throw "Hospital not updated";

		res.json({
			ok: true,
			updatedHospital,
		});
	} catch (error) {
		console.error(error);

		const msg = typeof error === "object" ? "Unexpected Error" : error;

		res.status(500).json({
			ok: false,
			msg,
		});
	}
};

const deleteHospital = async (req, res = response) => {
	try {
		const { id } = req.params;
		const hospitalExists = await Hospital.findById(id);
		if (!hospitalExists) throw "The hospital doesn't exists";

		await Hospital.findByIdAndDelete(id);

		res.json({
			ok: true,
			msg: "Hospital deleted successfully",
		});
	} catch (error) {
		console.error(error);
		const msg = typeof error === "object" ? "Unexpected Error" : error;
		res.status(500).json({
			ok: false,
			msg,
		});
	}
};

module.exports = {
	getHospitals,
	createHospital,
	updateHospital,
	deleteHospital,
};
