const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(
            filePath, {
                resource_type: 'auto',
            }
        );
        // Only delete the file if upload was successful and file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return response.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        // Only delete the file if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.log('Error uploading to Cloudinary:', error);
        return null;
    }
};

module.exports = {
    uploadOnCloudinary,
};