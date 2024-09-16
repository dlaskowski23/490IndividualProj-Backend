const express = require('express');
const router = express.Router();
const filmController = require('../controllers/film.controller');

router.get('/top-5', filmController.getTop5Films);
router.get('/:id', filmController.getFilmById);

module.exports = router;
