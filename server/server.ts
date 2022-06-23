import app from "./express";
import config from './config/config'

app.listen(config.port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info(`Application running on PORT: ${config.port}`)
    }
})