const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config');
const filmRoutes = require('./routes/film.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/films', filmRoutes);

// Test DB connection and sync models
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Database sync failed', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
