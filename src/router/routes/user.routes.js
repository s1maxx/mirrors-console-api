import {body} from "express-validator";

import userController from '../../controllers/user.contoller.js'

const userArrayGet = [
    {path:'/users', needAuth:true, function:userController.getUsers, description: "return all users from DB"},
    {path:'/user/:id', needAuth:true, function:userController.getUser, description: "return user by ID"},
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
        ], needAuth:true, function:userController.addUser, description: "add user to DB"},
]

const userArrayDelete = [
    {path:'/user/:id', needAuth:true, function:userController.removeUser, description: "remove user from DB"},
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
        ], needAuth:true, function:userController.updateUser, description: "update user from DB"},
]

export {userArrayUpdate, userArrayPost, userArrayDelete, userArrayGet};