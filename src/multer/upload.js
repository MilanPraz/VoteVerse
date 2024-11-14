import { getDynamicSignature } from './cloudinary.js';

const upload_uri = process.env.CLOUDINARY_UPLOAD_URL || '';
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY || '';
const cloudinary_preset = process.env.CLOUDINARY_UPLOAD_PRESET || '';

export default async function CloudinaryUpload({ image, folder }) {
    try {
        console.log('IMAGE XA:', image);
        console.log('FOLDER XA:', folder);
        console.log(upload_uri, cloudinary_api_key, cloudinary_preset);

        if (image) {
            const { timeStamp, signature } = await getDynamicSignature(folder);

            // Convert Buffer to Base64 string with MIME type prefix

            // const base64Img = `data:image/jpg;base64,${image.toString(
            //     'base64'
            // )}`;
            console.log('BUFFFERRRRR HO?:', Buffer.isBuffer(image));

            const base64Img = `data:image/jpg;base64,${image.data}`;
            const imageBlob = new Blob([image.buffer], {
                type: image.mimetype,
            }); // image.buffer is a Buffer

            const fd = new FormData();
            // fd.append('file', imageBlob);
            fd.append('file', imageBlob);
            fd.append('api_key', cloudinary_api_key);
            fd.append('signature', signature);
            fd.append('timestamp', timeStamp.toString());
            fd.append('folder', folder);
            fd.append('upload_preset', cloudinary_preset); // Add this line

            const res = await fetch(upload_uri, {
                method: 'POST',
                body: fd,
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            });

            console.log('RES:', res);

            if (res.ok) {
                const res_data = await res.json();
                return res_data;
            } else {
                throw new Error("Couldn't upload image.");
            }
        }
    } catch (err) {
        console.log('Error:', err);

        throw new Error('Failed to upload Image.');
    }
}
