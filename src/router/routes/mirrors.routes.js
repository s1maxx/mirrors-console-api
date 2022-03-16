import {body} from "express-validator";

import mirrorsController from "../../controllers/mirrors.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {mirrors, profiles} from "../../db/tables.js";

const mirrorArrayGet = [
    {path:'/mirrors', needAuth:true, table:mirrors, requiredRoles:[admin], function:mirrorsController.getMirrors, description: "return all mirrors from DB"},
    {path:'/mirror/search/:uuid', needAuth:true, requiredRoles:[admin, mirror_owner], table:mirrors, function:mirrorsController.getMirrorsLike, description: "return all mirrors like uuid from DB"},
    {path:'/mirrors/:id', needAuth:true, table:mirrors, requiredRoles:[admin, mirror_owner], function:mirrorsController.getMirrors, description: "return mirrors by user ID"},
    {path:'/mirror/:id', needAuth:true, table:mirrors, requiredRoles:[admin, mirror_owner], function:mirrorsController.getMirror, description: "return mirror by ID"},
]

const mirrorArrayPost = [
    {path:'/mirror/add', validate: [
            body('uuid', 'Invalid uuid'),
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], needAuth:true, table:mirrors, requiredRoles:[admin], function:mirrorsController.addMirror, description: "add mirror to DB"},
]

const mirrorArrayDelete = [
    {path:'/mirror/:id', needAuth:true, table:mirrors, requiredRoles:[admin], function:mirrorsController.removeMirror, description: "remove mirror from DB"},
]

const mirrorArrayUpdate = [
    {path:'/mirror/:id', validate: [
            body('uuid', 'Invalid uuid'),
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], needAuth:true, table:mirrors, requiredRoles:[admin], function:mirrorsController.updateMirror, description: "update user from DB"},
]

export {mirrorArrayGet, mirrorArrayPost, mirrorArrayUpdate, mirrorArrayDelete};