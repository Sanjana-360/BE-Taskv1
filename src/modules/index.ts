import { Router } from 'express';
import orderRoutes from './order/routes/order.routes';
import healthRoute from './health/healthRoute';
import { globalErrorHandler } from '../middlewares/errorHandler';

const Routes = Router();

// 1. Define the array directly or ensure IRoutes matches this structure
const allRoutes = [
    { path: '/orders', router: orderRoutes },

    { path: '/', router: healthRoute } // Removed the '.' from './health'
];

// 2. Loop through and apply them to the Router instance
allRoutes.forEach((route) => {
    Routes.use(route.path, route.router);
});

// 3. Attach global error handler AFTER all routes
Routes.use(globalErrorHandler);

// 4. CRITICAL: Export the instance 'Routes', not the class 'Router'
export default Routes;