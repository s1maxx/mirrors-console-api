import MirrorsService from "../service/mirrors.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class MirrorsController {
    async getMirrors(req, res, next) {
        try {
            const mirrors = await MirrorsService.getAllMirrors();
            return res.json(mirrors.rows);
        } catch (e) {
            next(e);
        }
    }
    async getMirror(req,res,next){
        try{
            const mirror = await MirrorsService.getMirror(req.params.id);
            return res.json(mirror.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async addMirror(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_mirror function', errors))
            }
            const mirror = await MirrorsService.createMirror(req.body);
            return res.json(mirror.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeMirror(req,res,next){
        try{
            await MirrorsService.removeMirror(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateMirror(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_mirror function', errors))
            }
            const updatedMirror = await MirrorsService.updateMirror(req.body, req.params.id);
            return res.json(updatedMirror.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new MirrorsController();