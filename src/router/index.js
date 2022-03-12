import {Router} from 'express';
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "./routes.js";

const router = new Router();

routesArrayGet.forEach((route)=>{
    router.get(route.path, route.function);
})

routesArrayPost.forEach((route)=>{
    router.post(route.path, ...route.validate, route.function);
})

routesArrayDelete.forEach((route)=>{
    router.delete(route.path, route.function);
})

routesArrayUpdate.forEach((route)=>{
    router.put(route.path, ...route.validate, route.function);
})

// console.log(router)

export default router;