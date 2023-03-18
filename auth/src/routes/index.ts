import { Router } from 'express';

import { defaultRoute } from './defaultRoute';
import { authRouter } from './auth';

export const routes = Router()

routes.use(defaultRoute)
routes.use(authRouter)