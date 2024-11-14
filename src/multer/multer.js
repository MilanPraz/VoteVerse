import multer from 'multer';

// Configure Multer to store images in memory (buffered)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const checkFileUpload = (req, res, next) => {
    if (req.file) {
        console.log('File received by Multer:', req.file);
    } else {
        console.log('No file uploaded.');
    }
    next();
};

export default upload;
