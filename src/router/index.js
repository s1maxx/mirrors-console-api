import {Router} from 'express';
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "./routes/index.js";

import authMiddleware from "../middlewares/auth-middleware.js";

const router = new Router();

routesArrayGet.forEach((route)=>{
    router.get(route.path, route.needAuth ? [authMiddleware, route.function] : route.function);
})

routesArrayPost.forEach((route)=>{
    router.post(route.path, ...route.validate, route.needAuth ? [authMiddleware, route.function] : route.function);
})

routesArrayDelete.forEach((route)=>{
    router.delete(route.path, route.needAuth ? [authMiddleware, route.function] : route.function);
})

routesArrayUpdate.forEach((route)=>{
    router.put(route.path, ...route.validate, route.needAuth ? [authMiddleware, route.function] : route.function);
})

export default router;