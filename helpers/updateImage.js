const fs = require("fs");
const { getCollection } = require("./getCollection");


const updateImage = async (collection, id, path, fileId) => {
	try {
		const collectionDB = getCollection(collection);
		if (!collectionDB) throw "Collection not found";

		const document = await collectionDB.findById(id);
		if (!document) throw "Document not found";

		const oldPath = path.replace(fileId, document.image);

		if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

		document.image = fileId;
		await document.save();

		return true;

	} catch (error) {
		console.error(error);
		return false;
	}
};

module.exports = { updateImage };
