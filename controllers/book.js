const Book = require('../models/Book');
const fs = require('fs');

exports.creatBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/opt${req.file.filename}`
    });
    
    book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.creatRateBook = (req, res) => {
    const gradeObject = req.body.rating;
    if (gradeObject === 0) {
        Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
    }
    else if (gradeObject < 0) {
        res.status(401).json({ message: 'La note doit être comprise entre 0 et 5 !' });
    } else if (gradeObject > 5) {
        res.status(401).json({ message: 'La note doit être comprise entre 0 et 5 !' });
    } else {
        const item = {
            userId: req.auth.userId,
            grade: req.body.rating
        };

        Book.findOne({ _id: req.params.id })
        .then(book => {
            book.ratings.filter(user => {
                if (user.userId === req.auth.userId) {
                    res.status(401).json({ message: 'Non-autorisé !' });
                }
            })
            const allRate = book.ratings.map(x => x.grade);
            allRate.push(gradeObject);
            const nbrRate = allRate.length;

            //  adition des elements du tableau
            let sum = 0;
            for (let i = 0; i < nbrRate; i++) {
                sum += allRate[i];
            }

            let average = sum / nbrRate;
            average = average.toFixed(1);

            Book.updateOne({ _id: req.params.id }, { $push: { ratings: item }, $set: { averageRating: average } })
            .then(() => {
                Book.findOne({ _id: req.params.id })
                .then(book => res.status(200).json(book))
                .catch(error => res.status(404).json({ error }));
            })
            .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
    }
};

exports.modifyBook = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/opt${req.file.filename}`
    } : { ...req.body };

    Book.findOne({_id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé !' });
        } else {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(401).json({ error }));
        }
        if(req.file) {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
        }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé !'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
            Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBook = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBestrating = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};