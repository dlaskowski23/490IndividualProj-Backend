const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db.config');

require('./models/associations.model')

app.use(cors());

app.use(express.json());
app.use('/films', require('./routes/film.routes'));

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('Database synced without altering tables');
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});
