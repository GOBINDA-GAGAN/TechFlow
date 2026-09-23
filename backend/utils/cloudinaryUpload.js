const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {},
            (error, result) => {
                if (error) {
                    console.error("CLOUDINARY UPLOAD ERROR:", error);
                    return reject(error);
                }

                console.log("UPLOAD SUCCESS:", result);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

module.exports = uploadToCloudinary;