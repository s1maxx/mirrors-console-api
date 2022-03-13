import apiController from '../../controllers/api.controller.js'
import {body} from "express-validator";

const apiArrayGet = [
    {path:'/', needAuth:true, function:apiController.getApiRoutes, description: "return all endpoints"},
    {path:'/tables', needAuth:true, function:apiController.getTables, description: "return all tables from DB"},
    {path:'/table/:name',needAuth:true,function:apiController.getTable, description: "return tables by name from DB"},
    {path:'/refresh',needAuth:false,function:apiController.refresh, description: "refresh token"},
    {path:'/me',needAuth:true,function:apiController.getMe, description: "return user"},
]

const apiArrayPost = [
    {path:'/login', validate:[
        body("username", "Invalid name").notEmpty(),
            body("password", "Invalid password").notEmpty()
        ], needAuth:false, function:apiController.login, description: "login"},
    {path:'/logout', validate:[
        ], needAuth:true, function:apiController.logout, description: "logout"},
]

const apiArrayDelete = [
]

const apiArrayUpdate = [
]

export {apiArrayUpdate, apiArrayDelete, apiArrayPost, apiArrayGet};