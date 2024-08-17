import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Define storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Define file filter to accept only images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        // Reject the file by calling the callback with an error
        return cb(new Error('Only images are allowed!'));
    }
    // Accept the file
    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
