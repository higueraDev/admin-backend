/* /api/hospitals */

const { Router } = require("express");
const { check } = require("express-validator");
const { getHospitals, createHospital, updateHospital, deleteHospital } = require("../controllers/hospitals");
const { fieldValidation } = require("../middlewares/field-validation");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

router.get("/", tokenValidation, getHospitals);

router.post(
	"/",
	[
		tokenValidation,
		check("name", "The name is required").notEmpty(),
		fieldValidation,
	],
	createHospital
);

router.put(
	"/:id",
	[
		tokenValidation,
		check("name", "The name is required").notEmpty(),
		fieldValidation,
	],
	updateHospital
);

router.delete("/:id", tokenValidation, deleteHospital);

module.exports = router;
