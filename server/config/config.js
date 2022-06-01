export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'my_secret',
    mongoUri: process.env.MONGO_HOST || 'mongodb://localhost:27017/social',
    redisUri: process.env.REDIS_HOST || ''
}