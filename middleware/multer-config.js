const multer = require('multer');
const fs = require('fs');
const sharp = require('./sharp-config')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => { sharp(req, file, callback); }
});

module.exports = multer({ storage: storage }).single('image');