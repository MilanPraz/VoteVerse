import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const getDynamicSignature = async (folder) => {
    const timeStamp = Math.round(new Date().getTime() / 1000).toString();

    // console.log(cloud_name, api_key, api_secret);
    console.log('UPLOAD PRESET:', process.env.CLOUDINARY_UPLOAD_PRESET);

    if (process.env.CLOUDINARY_API_SECRET) {
        // console.log('CLOUD NAMEEEEE:', process.env.CLOUDINARY_CLOUD_NAME);
        // console.log('CLOUD SECRETTTTT:', process.env.CLOUDINARY_API_SECRET);
        const params = {
            timestamp: timeStamp,
            folder,
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        };
        const signature = cloudinary.utils.api_sign_request(
            params,
            process.env.CLOUDINARY_API_SECRET
        );
        return { timeStamp, signature };
    } else {
        throw new Error('process.env.CLOUDINARY_API_SECRET is not Provided');
    }
};

// CLOUDINARY DELETE IMAGE
export const deleteCloudinaryImage = async (id) => {
    console.log('delete id xa?', id);
    try {
        await cloudinary.uploader.destroy(id);
        return {
            success: true,
            message: 'Deleted from Cloudinary',
        };
    } catch (err) {
        throw new Error("Couldn't Delete Cloudinary Image");
    }
};
