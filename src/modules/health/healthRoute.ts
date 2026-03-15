import { Router, Request, Response, NextFunction } from 'express'
const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send('I am okay');
    } catch (error) {
        next(error);
    }
})

export default router;