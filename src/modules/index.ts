import { Router } from 'express';
import orderRoutes from './order/routes/order.routes';
import healthRoute from './health/healthRoute';
import { globalErrorHandler } from '../middlewares/errors/global.error.handler';

const Routes = Router();


const allRoutes = [
    { path: '/orders', router: orderRoutes },

    { path: '/', router: healthRoute }
];

allRoutes.forEach((route) => {
    Routes.use(route.path, route.router);
});

Routes.use(globalErrorHandler);

export default Routes;