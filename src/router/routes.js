import {body} from "express-validator";

import userController from '../controllers/user-contoller.js'
import apiController from '../controllers/api-controller.js'
import mirrorsController from "../controllers/mirrors-controller.js";
import profilesController from "../controllers/profiles-controller.js";

const routesArrayGet = [
    {path:'/', function:apiController.getApiRoutes, description: "return all endpoints"},
    {path:'/users', function:userController.getUsers, description: "return all users from DB"},
    {path:'/user/:id', function:userController.getUser, description: "return user by ID"},
    {path:'/mirrors', function:mirrorsController.getMirrors, description: "return all mirrors from DB"},
    {path:'/mirror/:id', function:mirrorsController.getMirror, description: "return mirror by ID"},
    {path:'/profiles', function:profilesController.getProfiles, description: "return all profiles from DB"},
    {path:'/profile/:id', function:profilesController.getProfile, description: "return profile by ID"},
    {path:'/tables',function:apiController.getTables, description: "return all tables from DB"},
    {path:'/table/:name',function:apiController.getTable, description: "return tables by name from DB"}
]

const routesArrayPost = [
    {path:'/user/add', validate: [
            body('uuid', 'Invalid username').notEmpty().isLength({min: 4, max: 30}),
            body('email', 'Invalid email').notEmpty().isEmail(),
            body('password', 'Invalid password').notEmpty().isLength({min:4, max: 30}),
            body('role', 'Invalid role').notEmpty().isIn(['admin','mirrors-owner']),
            body('is_activated', 'Invalid activated state').notEmpty().isBoolean()
        ], function:userController.addUser, description: "add user to DB"},
    {path:'/mirror/add', validate: [
            body('uuid', 'Invalid uuid').notEmpty(),
            body('name', 'Invalid name').notEmpty(),
            body('description', 'Invalid description').notEmpty(),
            body('profile_id', 'Invalid profile id').notEmpty(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], function:mirrorsController.addMirror, description: "add mirror to DB"},
    {path:'/profile/add', validate: [
            body('name', 'Invalid name').notEmpty(),
            body('description', 'Invalid description').notEmpty(),
            body('profile_owner', 'Invalid profile owner'),
            body('version', 'Invalid version')
        ], function:profilesController.addProfile, description: "add profile to DB"}
]

const routesArrayDelete = [
    {path:'/user/:id', function:userController.removeUser, description: "remove user from DB"},
    {path:'/mirror/:id', function:mirrorsController.removeMirror, description: "remove mirror from DB"},
    {path:'/profile/:id', function:profilesController.removeProfile, description: "remove profile from DB"},
]

const routesArrayUpdate = [
    {path:'/user/:id', validate: [
            body('uuid', 'Invalid username').notEmpty().isLength({min: 4, max: 30}),
            body('email', 'Invalid email').notEmpty().isEmail(),
            body('password', 'Invalid password').notEmpty().isLength({min:4, max: 30}),
            body('role', 'Invalid role').notEmpty().isIn(['admin','mirrors-owner']),
            body('is_activated', 'Invalid activated state').notEmpty().isBoolean(),
        ], function:userController.updateUser, description: "update user from DB"},
    {path:'/mirror/:id', validate: [
            body('uuid', 'Invalid uuid').notEmpty(),
            body('name', 'Invalid name').notEmpty(),
            body('description', 'Invalid description').notEmpty(),
            body('profile_id', 'Invalid profile id').notEmpty(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], function:mirrorsController.updateMirror, description: "update user from DB"},
    {path:'/profile/:id', validate: [
            body('name', 'Invalid name').notEmpty(),
            body('description', 'Invalid description').notEmpty(),
            body('profile_owner', 'Invalid profile owner'),
            body('version', 'Invalid version')
        ], function:profilesController.updateProfile, description: "update profile from DB"}
]

export {routesArrayPost, routesArrayGet, routesArrayDelete, routesArrayUpdate};