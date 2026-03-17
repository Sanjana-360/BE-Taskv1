import express from 'express';
import { globalErrorHandler } from './middlewares/errors/global.error.handler';
import mongoose from 'mongoose';
import DOT_ENV from './config-env';
import rateLimiter from './middlewares/rateLimiter';

import morgan from 'morgan'
import Routes from './modules/index'

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();

        this.initializeErrorHandling();



    }

    private initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(
            express.urlencoded({
                limit: '50mb',
                extended: true,
                parameterLimit: 20000,
            }),
        );
        this.app.use(rateLimiter);
        this.app.use(morgan('dev'));
    }

    private initializeRoutes() {
        this.app.use(Routes);
    }

    private initializeErrorHandling() {
        this.app.use(globalErrorHandler);
    }
    public listen() {
        this.app.listen(DOT_ENV.PORT, () => {
            console.log(`App is listening on port ${DOT_ENV.PORT}`)
            this.databaseConnection();
        });

    }


    public databaseConnection() {

        mongoose
            .connect(DOT_ENV.DATABASE_URL)
            .then(() => {
                console.log('Connected to the database');
            })
            .catch((error) => {
                console.error('Error connecting to the database:', error);
            });
    }
}