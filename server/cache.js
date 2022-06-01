import {createClient} from 'redis';
import config from "./config/config";

const client = createClient({
    url: config.redisUri
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Connected to Redis Client'))

export default client;