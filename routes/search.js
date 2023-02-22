/* /api/search/ */
const { Router } = require("express");
const { search } = require("../controllers/search");
const { searchByCollection } = require("../controllers/searchByCollection");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

router.post("/:query", tokenValidation, search);
router.post("/collection/:table/:query", tokenValidation, searchByCollection);

module.exports = router;
