import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compress from "compression";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import errorController from './controllers/error.controller';
import React from 'react';

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());
app.use(compress());
app.use(cors());


app.use('/', authRouter);
app.use(userRouter);

app.use(errorController.handleError)


export default app;