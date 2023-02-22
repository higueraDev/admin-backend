/* /api/download */
const { Router } = require("express");
const { download } = require("../controllers/download");

const router = Router();

router.get("/:collection/:id",download);

module.exports = router;
