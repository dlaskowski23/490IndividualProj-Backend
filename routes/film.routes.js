const express = require('express');
const router = express.Router();

const filmController = require('../controllers/film.controller');

// Route to search films by title, actor, or category
router.get('/search', filmController.searchFilms);

// Route to get all films
router.get('/', filmController.getAllFilms);

// Route to get top 5 films
router.get('/top-5', filmController.getTop5Movies);

// Route to get top 5 actors
router.get('/actors/top-5', filmController.getTop5Actors);

// Route to get actor's top films and details
router.get('/actors/:id/top-films', filmController.getActorDetailsWithTopFilms);

// Route to get a specific film by ID
router.get('/:id', filmController.getMovieById);

module.exports = router;