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

		if (physicianExists) throw "The Physician's name already exists";

		const validHospital = await Hospital.findById(hospital);

		if (!validHospital) throw "The hospital doesn't exist";

		const physician = new Physician({ createdBy, ...req.body });

		const physicianDB = await physician.save();

		res.json({ ok: true, physicianDB });
	} catch (error) {
		console.error(error);
		const msg = typeof error === "object" ? "Unexpected Error" : error;

		res.status(500).json({
			ok: false,
			msg,
		});
	}
};
const updatePhysician = async (req, res = response) => {
	try {
		const { id } = req.params;
		const physicianExists = await Physician.findById(id);
		if (!physicianExists) throw "The Physician doesn't exists";

		const { name: newName, image, hospital, ...body } = req.body;

		const hospitalHasChanged =
			hospital && hospital !== physicianExists.hospital;

		const hospitalExists = await Hospital.findById(hospital);

		if (hospitalHasChanged && !hospitalExists)
			throw "The Hospital doesn't exists";

		const nameHasChanged = newName !== physicianExists.name;

		const nameExists = await Physician.findOne({ name: newName });

		if (nameHasChanged && nameExists)
			throw "The Physician's name already exists";

		const createdBy = req.uid;

		const changes = {
			...body,
			name: newName,
			createdBy,
		};

		if (hospitalHasChanged) changes.hospital = hospital;

		const physicianDB = await Physician.findByIdAndUpdate(id, changes, {
			new: true,
		});

		res.json({ ok: true, physicianDB });
	} catch (error) {
		console.error(error);

		const unknownError = typeof error === "object";
		const code = unknownError ? 500 : 400;
		const msg = unknownError ? "Unexpected Error" : error;

		res.status(code).json({
			ok: false,
			msg,
		});
	}
};
const deletePhysician = async (req, res = response) => {
	try {
		const { id } = req.params;
		const physicianExists = await Physician.findById(id);
		if (!physicianExists) throw "Physician doesn't exist";

		await Physician.findByIdAndDelete(id);

		res.json({ ok: true , msg : "Physician deleted successfully"});
	} catch (error) {
		console.error(error);
		const unknownError = typeof error === "object";
		const code = unknownError ? 500 : 400;
		const msg = unknownError ? "Unexpected Error" : error;

		res.status(code).json({
			ok: false,
			msg,
		});
	}
};

module.exports = {
	getPhysicians,
	updatePhysician,
	createPhysician,
	deletePhysician,
};
