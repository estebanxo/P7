const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        fs.access("../images", (error) => {
            if (error) {
              fs.mkdirSync("../images");
            }
        });
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname;
        const ref = `${name}-${Date.now()}.webp`;

        console.log(name);
        console.log(ref);
        // const data = sharp(name).webp({ lossless: true }).toBuffer();
        sharp("name").webp( {quality: 20} ).resize(405).toFile('../images', ref)
        .then(function(info) {
            console.log(info)
            callback(null, ref);
        })
        .catch(function(err) {
            console.log(err)
        })
        callback(null, ref);
    }
});

module.exports = multer({ storage: storage }).single('image');