import jwt from 'jsonwebtoken';
import config from "../config/config";
import expressJwt from 'express-jwt';
import UserModel from "../models/user.model";
import {AuthenticationError} from "../helpers/dbErrorHandler";
import redisClient from '../cache';

const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const userInDb = await UserModel.authenticate({email, password});

        const token = await jwt.sign({id: userInDb.id}, config.jwtSecret);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 900000),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: process.env.NODE_ENV === 'production'
        })

        return res.status(200).json(
            {
                token,
                userInDb
            }
        )
    } catch (error) {
        if (error instanceof AuthenticationError) {
            return res.status(401).json({
                error: "Could not sign in"
            })
        }
        next(error)
    }

}

const signOut = async (req, res) => {
    try {
        const token = getBearerToken(req)
        await redisClient.set(token, token)
        res.clearCookie('token');
        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "Something went wrong"
        })
    }

}

const checkBlackList = async (req, res, next) => {
    try {
        const token = getBearerToken(req);
        const redisToken = await redisClient.GET(token)
        if (redisToken !== null) {
            return res.status(401).send()
        }
        next()
    } catch (e) {
        next()
    }


}

const hasAuthorization = async (req, res, next) => {
    const authorized = req.user && req.auth && req.user.id.toString() === req.auth.id
    if (!authorized) {
        return res.status(403).send();
    }
    next()
}

const getBearerToken = (req) => {
    return req.headers.authorization.split(" ")[1];
}

const requireSignIn = expressJwt(
    {
        secret: config.jwtSecret,
        algorithms: ['HS256'],
        requestProperty: 'auth',
        getToken: (req) => {
            if (req.cookies.token) {
                return req.cookies.token;
            } else if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                return getBearerToken(req);
            }
            return null;
        }
    }
)

export default {signIn, signOut, hasAuthorization, requireSignIn, checkBlackList}