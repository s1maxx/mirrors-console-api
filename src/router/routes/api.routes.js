import apiController from '../../controllers/api.controller.js'
import {body} from "express-validator";
import {admin} from "../../db/roles.js";

const apiArrayGet = [
    {path:'/', needAuth:true, requiredRoles:[admin], function:apiController.getApiRoutes, description: "return all endpoints"},
    {path:'/tables', needAuth:true, requiredRoles:[admin], function:apiController.getTables, description: "return all tables from DB"},
    {path:'/table/:name',needAuth:true, requiredRoles: [admin], function:apiController.getTable, description: "return tables by name from DB"},
    {path:'/refresh',needAuth:false, requiredRoles: [], function:apiController.refresh, description: "refresh token"},
    {path:'/me',needAuth:true, requiredRoles:[], function:apiController.getMe, description: "return user"},
]

const apiArrayPost = [
    {path:'/login', validate:[
        body("username", "Invalid name"),
            body("email", "Invalid email"),
            body("password", "Invalid password").notEmpty()
        ], needAuth:false, requiredRoles:[], function:apiController.login, description: "login"},
    {path:'/logout', validate:[
        ], needAuth:true, requiredRoles:[], function:apiController.logout, description: "logout"},
]

const apiArrayDelete = [
]

const apiArrayUpdate = [
]

export {apiArrayUpdate, apiArrayDelete, apiArrayPost, apiArrayGet};