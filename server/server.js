import mongoose from "mongoose";
import app from "./express";
import config from './config/config'


// devBundle.compile(app);
mongoose.connect(config.mongoUri);

mongoose.connection.on('connected', () => {
    console.info('Database connection established')
});

mongoose.connection.on('error', () => {
    console.error('There was an error establishing the  database connection')
})

mongoose.connection.on('disconnected', () => {
    console.info('Database connection lost');
})


app.listen(config.port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info(`Application running on PORT: ${config.port}`)
    }
})