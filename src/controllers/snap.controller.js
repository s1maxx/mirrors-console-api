import SnapService from "../service/snap.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class SnapsController {
    async getAllSnaps(req,res,next)
    {
        try{
            const snap = await SnapService.getAllSnaps(req.params.id);
            return res.json(snap.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async getSnap(req,res,next){
        try{
            const snap = await SnapService.getSnap(req.params.id);
            return res.json(snap.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async addSnap(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_snap function', errors))
            }
            const snap = await SnapService.createSnap(req.body);
            return res.json(snap.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeSnap(req,res,next){
        try{
            await SnapService.removeSnap(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateSnap(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_snap function', errors))
            }
            const updatedSnap = await SnapService.updateSnap(req.body, req.params.id);
            return res.json(updatedSnap.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new SnapsController();