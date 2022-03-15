import {body} from "express-validator";

import userController from '../../controllers/user.contoller.js'
import {admin} from "../../db/roles.js";
import {users} from "../../db/tables.js";

const userArrayGet = [
    {path:'/users', needAuth:true, requiredRoles:[admin], table:users, function:userController.getUsers, description: "return all users from DB"},
    {path:'/user/:id', needAuth:true, requiredRoles:[admin], table:users, function:userController.getUser, description: "return user by ID"},
]

const userArrayPost = [
    {path:'/user/add', validate: [
            body('uuid', 'Invalid username'),
            body('email', 'Invalid email').isEmail(),
            body('password', 'Invalid password'),
            body('role', 'Invalid role').notEmpty().isIn(['admin','mirrors-owner']),
            body('is_activated', 'Invalid activated state').isBoolean(),
            body('zipcode', 'Invalid zipcode'),
            body('description', 'Invalid description'),
        ], needAuth:true, requiredRoles:[admin], table:users, function:userController.addUser, description: "add user to DB"},
]

const userArrayDelete = [
    {path:'/user/:id', needAuth:true, requiredRoles:[admin], table:users, function:userController.removeUser, description: "remove user from DB"},
]

const userArrayUpdate = [
    {path:'/user/:id', validate: [
            body('uuid', 'Invalid username'),
            body('email', 'Invalid email').isEmail(),
            body('password', 'Invalid password'),
            body('role', 'Invalid role').notEmpty().isIn(['admin','mirrors-owner']),
            body('is_activated', 'Invalid activated state').isBoolean(),
            body('zipcode', 'Invalid zipcode'),
            body('description', 'Invalid description'),
        ], needAuth:true, requiredRoles:[admin], table:users, function:userController.updateUser, description: "update user from DB"},
]

export {userArrayUpdate, userArrayPost, userArrayDelete, userArrayGet};