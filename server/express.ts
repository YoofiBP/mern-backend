import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compress from "compression";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import errorController from './controllers/error.controller';
import authController from './controllers/auth.controller';
import postRouter from "./routes/post.routes";

const app = express();

//TODO: Try out caching
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());
app.use(compress());
app.use(cors());


app.use(authController.checkBlackList)
app.use('/', authRouter);
app.use(userRouter);
app.use(postRouter)

app.use(errorController.handleError)


export default app;