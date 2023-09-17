const express = require("express");

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books', (req, res, next) => {
    const BOOKS = [
      {
        userId: 'oeihfzeoi',
        title: 'Mon premier objet',
        author: 'Anonimous',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year: 2012,
        genre: 'fiction',
        ratings: [
            {
                userId:'oeihfzeoi',
                grade:4,
            }
        ],
        averageRating:4,
      },
      {
        userId: 'oeihfzeoi',
        title: 'Mon second objets',
        author: 'Anonimous',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year: 2015,
        genre: 'aventure',
        ratings: [
            {
                userId:'oeihfzeoi',
                grade:5,
            }
        ],
        averageRating:5,
      },
    ];
    res.status(200).json(BOOKS);
  });

module.exports = app;