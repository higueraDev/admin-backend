/* /api/upload */
const { Router } = require("express");
const { upload } = require("../controllers/upload");
const fileUpload = require("express-fileupload");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

router.use(fileUpload());

router.put("/:collection/:id", tokenValidation,upload)

module.exports = router;
