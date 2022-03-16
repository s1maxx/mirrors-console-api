import {body} from "express-validator";

import profileSettingsController from "../../controllers/profile_settings.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {profile_settings} from "../../db/tables.js";

const profileSettingsArrayGet = [
    {path:'/profile/settings/:id', requiredRoles:[admin,mirror_owner], table:profile_settings, needAuth:true, function:profileSettingsController.getProfileSettings, description: "return profile settings by ID"},
    {path:'/profile/settings-array/:id', requiredRoles:[admin,mirror_owner], table:profile_settings, needAuth:true, function:profileSettingsController.getProfileSettingsArray, description: "return profile settings array by ID"},
]

const profileSettingsArrayPost = [
    {path:'/profile/settings/add', validate: [
            body('name', 'Invalid name'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_settings, function:profileSettingsController.addProfileSettings, description: "add profile settings to DB"},
    {path:'/profile/settings/add', validate: [
        body().isArray,
            body('*.name', 'Invalid name'),
            body('*.profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('*.enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_settings, function:profileSettingsController.addProfileSettingsArray, description: "add profile array settings to DB"}
]

const profileSettingsArrayDelete = [
    {path:'/profile/settings/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_settings, function:profileSettingsController.removeProfileSettings, description: "remove profile settings from DB"},
]

const profileSettingsArrayUpdate = [
    {path:'/profile/settings/:id', validate: [
            body('name', 'Invalid name'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_settings, function:profileSettingsController.updateProfileSettings, description: "update profile settings from DB"},
    {path:'/profile/settings', validate: [
            body().isArray,
            body('*.id', "Invalid id").notEmpty().isNumeric(),
            body('*.name', 'Invalid name'),
            body('*.profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('*.enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_settings, function:profileSettingsController.updateProfileSettingsArray, description: "update profile array settings to DB"}
]

export {profileSettingsArrayUpdate, profileSettingsArrayPost, profileSettingsArrayDelete, profileSettingsArrayGet};