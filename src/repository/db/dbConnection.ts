import config from 'config';
import mongoose from 'mongoose';
import { logger } from '../../util/asyncLocalStorageLog';

export default {

    connect: function () {
        mongoose.connect(config.get('configDB.mongo.host'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => logger.info('Mongo DB connection successful'))
            .catch(err => logger.error('Mongo DB connection error...', err));

        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
    },
};