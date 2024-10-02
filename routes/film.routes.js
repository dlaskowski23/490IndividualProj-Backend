const express = require('express');
const router = express.Router();
const filmController = require('../controllers/film.controller');

// Route to get top 5 films
router.get('/top-5', filmController.getTop5Movies);

// Route to get a specific film by ID
router.get('/:id', filmController.getMovieById);

module.exports = router;
