import express from 'express';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middlewares/errorHandler';


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
        this.app.use(rateLimit);
    }

    private initializeRoutes() {

    }

    private initializeErrorHandling() {
        this.app.use(globalErrorHandler);
    }
}