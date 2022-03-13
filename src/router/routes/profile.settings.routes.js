import {body} from "express-validator";

import profileSettingsController from "../../controllers/profile_settings.controller.js";

const profileSettingsArrayGet = [
    {path:'/profile/settings/:id', needAuth:true, function:profileSettingsController.getProfileSettings, description: "return profile settings by ID"},
]

const profileSettingsArrayPost = [
    {path:'/profile/settings/add', validate: [
            body('name', 'Invalid name'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileSettingsController.addProfileSettings, description: "add profile settings to DB"}
]

const profileSettingsArrayDelete = [
    {path:'/profile/settings/:id', needAuth:true, function:profileSettingsController.removeProfileSettings, description: "remove profile settings from DB"},
]

const profileSettingsArrayUpdate = [
    {path:'/profile/settings/:id', validate: [
            body('name', 'Invalid name'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileSettingsController.updateProfileSettings, description: "update profile settings from DB"}
]

export {profileSettingsArrayUpdate, profileSettingsArrayPost, profileSettingsArrayDelete, profileSettingsArrayGet};