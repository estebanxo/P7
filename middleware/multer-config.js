const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname;
        callback(null, name + Date.now() + '.webp');
    }
});

module.exports = multer({ storage: storage }).single('image');