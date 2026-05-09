const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/profile',     require('./routes/profile'));
app.use('/api/vitals',      require('./routes/vitals'));
app.use('/api/exercise',    require('./routes/exercise'));
app.use('/api/diet',        require('./routes/diet'));
app.use('/api/medical',     require('./routes/medical'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/progress',    require('./routes/progress'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));