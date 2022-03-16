import {Router} from 'express';
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "./routes/index.js";

import authMiddleware from "../middlewares/auth-middleware.js";
import roleMiddleware from "../middlewares/auth-role-middleware.js"

const router = new Router();
const required = (route, req, res, next) =>
{
    if(route.requiredRoles) req.requiredRoles = route.requiredRoles;
    if(route.table) req.table = route.table;
    next();
}

routesArrayGet.forEach((route)=>{

    const middleWares = [];
    if(route.needAuth)
        middleWares.push(authMiddleware);
    if(route.requiredRoles && route.requiredRoles.length > 0)
        middleWares.push(roleMiddleware);

    router.get(
        route.path,
        (req, res, next)=>{required(route, req, res, next)},
        ...middleWares,
        route.function);
})

routesArrayPost.forEach((route)=>{
    const middleWares = [];
    if(route.needAuth)
        middleWares.push(authMiddleware);
    if(route.requiredRoles && route.requiredRoles.length > 0)
        middleWares.push(roleMiddleware);

    router.post(
        route.path,
        (req, res, next)=>{required(route, req, res, next)},
        ...middleWares,
        route.function);
})

routesArrayDelete.forEach((route)=>{
    const middleWares = [];
    if(route.needAuth)
        middleWares.push(authMiddleware);
    if(route.requiredRoles && route.requiredRoles.length > 0)
        middleWares.push(roleMiddleware);

    router.delete(
        route.path,
        (req, res, next)=>{required(route, req, res, next)},
        ...middleWares,
        route.function);})

routesArrayUpdate.forEach((route)=>{
    const middleWares = [];
    if(route.needAuth)
        middleWares.push(authMiddleware);
    if(route.requiredRoles && route.requiredRoles.length > 0)
        middleWares.push(roleMiddleware);

    router.put(
        route.path,
        (req, res, next)=>{required(route, req, res, next)},
        ...middleWares,
        route.function);})

export default router;