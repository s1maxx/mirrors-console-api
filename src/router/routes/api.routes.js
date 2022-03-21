import apiController from '../../controllers/api.controller.js'
import {body} from "express-validator";
import {admin} from "../../db/roles.js";

const apiArrayGet = [
    {path:'/', needAuth:true, requiredRoles:[admin], function:apiController.getApiRoutes, description: "return all endpoints"},
    {path:'/tables', needAuth:true, requiredRoles:[admin], function:apiController.getTables, description: "return all tables from DB"},
    {path:'/table/:name',needAuth:true, requiredRoles: [admin], function:apiController.getTable, description: "return tables by name from DB"},
    {path:'/refresh',needAuth:false, requiredRoles: [], function:apiController.refresh, description: "refresh token"},
    {path:'/me',needAuth:true, requiredRoles:[], function:apiController.getMe, description: "return user"},
    {path:'/rec-pass/:email&:uuid',needAuth:false, requiredRoles:[], function:apiController.recoveryPassword, description: "recovery password"},
    {path:'/dec-rec-pass/:uuid',needAuth:false, requiredRoles:[], function:apiController.declineRecoveryPassword, description: "decline recovery password"},
    {path:'/validate/:uuid',needAuth:false, requiredRoles:[], function:apiController.validateUUid, description: "validate"},
]

const apiArrayPost = [
    {path:'/login', validate:[
        body("username", "Invalid name"),
            body("email", "Invalid email"),
            body("password", "Invalid password").notEmpty()
        ], needAuth:false, requiredRoles:[], function:apiController.login, description: "login"},
    {path:'/logout', validate:[
        ], needAuth:true, requiredRoles:[], function:apiController.logout, description: "logout"},
    {path:'/rec-pass', validate:[
        body('email', "Invalid email").isEmail()
        ], needAuth:false, requiredRoles:[], function:apiController.sendRecovery, description: "send recovery message"},
    {path:'/change-password', validate:[
            body('password', "Invalid password").notEmpty(),
            body('uuid', "Invalid uuid").notEmpty()
        ], needAuth:false, requiredRoles:[], function:apiController.changePassword, description: "change password"},
]

const apiArrayDelete = [
]

const apiArrayUpdate = [
]

export {apiArrayUpdate, apiArrayDelete, apiArrayPost, apiArrayGet};