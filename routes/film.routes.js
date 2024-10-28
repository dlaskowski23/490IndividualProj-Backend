const express = require('express');
const router = express.Router();

const filmController = require('../controllers/film.controller');

router.get('/search', filmController.searchFilms);

router.get('/', filmController.getAllFilms);

router.get('/top-5', filmController.getTop5Movies);

router.get('/actors/top-5', filmController.getTop5Actors);

router.get('/actors/:id/top-films', filmController.getActorDetailsWithTopFilms);

router.get('/:id', filmController.getMovieById);

module.exports = router;