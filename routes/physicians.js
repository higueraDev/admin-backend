/* /api/physicians */

const { Router } = require("express");
const { check } = require("express-validator");
const {
	deletePhysician,
	getPhysicians,
	createPhysician,
	updatePhysician,
} = require("../controllers/physicians");
const { fieldValidation } = require("../middlewares/field-validation");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

router.get("/", tokenValidation, getPhysicians);
router.post(
	"/",
	[
		tokenValidation,
		check("name", "The name is required").notEmpty(),
		check("hospital", "The hospital id is not valid").isMongoId(),
		fieldValidation,
	],

	createPhysician
);
router.put(
	"/:id",
	[
		tokenValidation,
		check("id", "The Physician's id is not valid").isMongoId(),
		check("name", "The name is required").notEmpty(),
		fieldValidation,
	],
	fieldValidation,
	updatePhysician
);
router.delete(
	"/:id",
	[
		tokenValidation,
		check("id", "The Physician's id is not valid").isMongoId(),
		fieldValidation
	],
	deletePhysician
);

module.exports = router;
