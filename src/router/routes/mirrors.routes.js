import {body} from "express-validator";

import mirrorsController from "../../controllers/mirrors.controller.js";

const mirrorArrayGet = [
    {path:'/mirrors', needAuth:true, function:mirrorsController.getMirrors, description: "return all mirrors from DB"},
    {path:'/mirror/:id', needAuth:true, function:mirrorsController.getMirror, description: "return mirror by ID"},
]

const mirrorArrayPost = [
    {path:'/mirror/add', validate: [
            body('uuid', 'Invalid uuid'),
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], needAuth:true, function:mirrorsController.addMirror, description: "add mirror to DB"},
]

const mirrorArrayDelete = [
    {path:'/mirror/:id', needAuth:true, function:mirrorsController.removeMirror, description: "remove mirror from DB"},
]

const mirrorArrayUpdate = [
    {path:'/mirror/:id', validate: [
            body('uuid', 'Invalid uuid'),
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('teamviewer_id', 'Invalid teamviewer id')
        ], needAuth:true, function:mirrorsController.updateMirror, description: "update user from DB"},
]

export {mirrorArrayGet, mirrorArrayPost, mirrorArrayUpdate, mirrorArrayDelete};