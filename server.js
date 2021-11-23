const express = require('express');
const users = require('./routes/users');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const config = require('config');

/* Mongo DB Configuration */
const mongoose = require('mongoose');

mongoose.connect(config.get('configDB.host'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Mongo DB connection successful'))
    .catch(err => console.log('Mongo DB connection error...', err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

/* END Mongo DB */

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API REST up & running');
});