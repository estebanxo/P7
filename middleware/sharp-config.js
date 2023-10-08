const sharp = require('sharp');
const fs = require('fs').promises;

module.exports = async (req, res, next) => {

    if (req.file) {

        try {
            const imagePath = `images/${req.file.filename}`;
    
            await sharp(imagePath)
                .webp( {quality: 20} )
                .resize(405)
                .toFile(`images/opt${req.file.filename}`)
        
            await fs.unlink(imagePath, (error) => {
                if (error) return res.status(400).json({ error });
            });
        
            next();

        } catch(error) {
            return res.status(500).json({ error });
        }

    } else next();
}