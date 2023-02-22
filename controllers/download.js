const { response } = require("express");
const path = require("path");
const fs = require("fs");

const download = async (req, res = response) => {
	try {
		const { collection, id } = req.params;

		const pathImage = path.join(
			__dirname,
			`../uploads/${collection}/${id}`
		);

		const defaultImage = path.join(__dirname, `../uploads/no-img.jpg`);

		if (!fs.existsSync(pathImage)) return res.sendFile(defaultImage);

		return res.sendFile(pathImage);

	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

module.exports = {
	download,
};
