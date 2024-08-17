import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads folder created.');
} else {
    console.log('Uploads folder already exists.');
}
