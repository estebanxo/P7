const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, file, callback) => {
    fs.access("../images", (error) => {
        if (error) {
          fs.mkdirSync("../images");
        }
    });

    const name = file.originalname;
    const ref = `${name}-${Date.now()}.webp`;

    console.log(name);
    console.log(ref);

    sharp(`${name}`).webp( {quality: 20} ).resize(405).toFile('../images', ref)
    .then(function(info) {
        console.log(info)
        callback(null, ref);
    })
    .catch(function(err) {
        console.log(err)
    })
}