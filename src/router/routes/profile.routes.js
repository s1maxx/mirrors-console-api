import {body} from "express-validator";

import profilesController from "../../controllers/profiles.controller.js";

const profileArrayGet = [
    {path:'/profiles', needAuth:true, function:profilesController.getProfiles, description: "return all profiles from DB"},
    {path:'/profile/:id', needAuth:true, function:profilesController.getProfile, description: "return profile by ID"},
]

const profileArrayPost = [
    {path:'/profile/add', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_owner', 'Invalid profile owner').notEmpty().isNumeric(),
            body('version', 'Invalid version').isNumeric()
        ], needAuth:true, function:profilesController.addProfile, description: "add profile to DB"}
]

const profileArrayDelete = [
    {path:'/profile/:id', needAuth:true, function:profilesController.removeProfile, description: "remove profile from DB"},
]

const profileArrayUpdate = [
    {path:'/profile/:id', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_owner', 'Invalid profile owner').notEmpty().isNumeric(),
            body('version', 'Invalid version').isNumeric()
        ], needAuth:true, function:profilesController.updateProfile, description: "update profile from DB"}
]

export {profileArrayUpdate, profileArrayGet, profileArrayPost, profileArrayDelete};