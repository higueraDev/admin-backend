const { response } = require("express");
const { v4: uuid } = require("uuid");
const { updateImage } = require("../helpers/updateImage");

const checkExtension = (extension) => {
	const validExtensions = ["png", "jpg", "jpeg", "gif"];

	return validExtensions.includes(extension);
};

const handleErrors = (error, res) => {
	const errors = {
		files: { msg: "File is empty", code: 400 },
		extension: { msg: "Extension not supported", code: 400 },
		fileStorage: { msg: "The image could not be stored", code: 500 },
		imageUpdate: { msg: "The image could not be updated", code: 400 },
	};

	return res.status(errors[error].code).json({
		ok: false,
		msg: errors[error].msg,
	});
};

const upload = (req, res = response) => {
	try {
		const files = req.files;

		if (!files) return handleErrors("files", res);

		const { image } = files;

		const { name } = image;

		const fileNameSplitted = name.split(".");

		const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

		const validExtension = checkExtension(fileExtension);

		if (!validExtension) return handleErrors("extension", res);

		const { collection, id } = req.params;

		const fileId = uuid() + "." + fileExtension;

		const path = `./uploads/${collection}/${fileId}`;

		return image.mv(path, async (err) => {
			if (err) {
				console.log(err);
				return handleErrors("fileStorage", res);
			}

			const imageUpdated = await updateImage(collection, id, path, fileId);

			if (!imageUpdated) return handleErrors("imageUpdate", res);

			res.json({
				ok: true,
				msg: "Image updated successfully",
			});
		});
		
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

module.exports = {
	upload,
};
