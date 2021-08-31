const express = require('express');
const mongoose = require('mongoose');
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const config = require('config');

mongoose.connect(config.get('configDB.host'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Mongo DB connection successful'))
    .catch(err => console.log('Mongo DB connection error...', err));

mongoose.set('useCreateIndex', true);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API REST up & running');
});
