import {body} from "express-validator";

import profilesController from "../../controllers/profiles.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {profiles} from "../../db/tables.js";

const profileArrayGet = [
    {path:'/profiles', needAuth:true, requiredRoles:[admin], table:profiles, function:profilesController.getProfiles, description: "return all profiles from DB"},
    {path:'/profile/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table: profiles, function:profilesController.getProfile, description: "return profile by ID"},
    {path:'/profiles/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table: profiles, function:profilesController.getProfiles, description: "return profiles by user ID"},
    {path:'/profile/mirrors/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table: profiles, function:profilesController.getProfileMirrors, description: "return profile-mirrors by profile_id"},
]

const profileArrayPost = [
    {path:'/profile/add', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_owner', 'Invalid profile owner').notEmpty().isNumeric(),
            body('version', 'Invalid version').isNumeric()
        ], needAuth:true, requiredRoles:[], table:profiles, function:profilesController.addProfile, description: "add profile to DB"}
]

const profileArrayDelete = [
    {path:'/profile/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table:profiles, function:profilesController.removeProfile, description: "remove profile from DB"},
]

const profileArrayUpdate = [
    {path:'/profile/:id', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_owner', 'Invalid profile owner').notEmpty().isNumeric(),
            body('version', 'Invalid version').isNumeric()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profiles, function:profilesController.updateProfile, description: "update profile from DB"}
]

export {profileArrayUpdate, profileArrayGet, profileArrayPost, profileArrayDelete};