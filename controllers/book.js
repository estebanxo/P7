const Book = require('../models/Book');
const fs = require('fs');

exports.creatBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.creatRateBook = (req, res, next) => {
    const bookObject = req.body;
    delete bookObject._userId;
    const gradeObject = req.body.rating;
    const item = {
        userId: req.auth.userId,
        grade: req.body.rating,
        _id: req.params.id
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
        console.log(allRate);
        const nbrRate = allRate.length;
        console.log(nbrRate);

        //  adition des elements du tableau
        let sum = 0;
        for (let i = 0; i < nbrRate; i++) {
            sum += allRate[i];
        }
        console.log(sum);

        let average = sum / nbrRate;
        console.log(average);

        Book.updateOne({ _id: req.params.id }, { $push: { ratings: item }, $set: { averageRating: average } })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé !' });
        } else {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé !'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            console.log(filename + " = filename");
            fs.unlinkSync(`images/${filename}`);
            Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

const sort = [{$sort : {"averageRating" : -1}}];

exports.getBestrating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    // .then(book => {
    //     let averagesRatings = book.filter(x => x.averageRating);

    //     let highestGrades = [];
    //     for (let i = 0; i < 3; i++) {
    //         highestGrades.push(Math.max(...averagesRatings));
    //     }
    //     console.log(highestGrades);
         
    //     let booksWithHighestGrades = [];
    //     booksWithHighestGrades = book.filter(obj => {
    //         for (let i = 0; i < 3; i++) {
    //             obj.averageRating === highestGrades[i];
    //         }
    //     })
    //     console.log(booksWithHighestGrades);
    //     return booksWithHighestGrades;
    // })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};