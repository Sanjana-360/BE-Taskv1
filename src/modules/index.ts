
import { IRoutes } from './routes.types'
import orderRoutes from './order/routes/order.routes';
import { Router } from 'express';
import { globalErrorHandler } from '../middlewares/errorHandler';
const Routes = Router();
import healthRoute from './health/healthRoute'

const routes: IRoutes = {
    allRoutes: [
        { path: '/order', router: orderRoutes },
        { path: './health', router: healthRoute }
    ]
}

routes.allRoutes.forEach((route) => {
    Routes.use(route.path, route.router);
});

Routes.use(globalErrorHandler);
export default Router;