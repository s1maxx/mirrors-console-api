import UserService from "../service/user-service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users.rows);
        } catch (e) {
            next(e);
        }
    }
    async getUser(req,res,next){
        try{
            const user = await UserService.getUser(req.params.id);
            return res.json(user.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async addUser(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_user function', errors))
            }
            const user = await UserService.createUser(req.body);
            return res.json(user.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeUser(req,res,next){
        try{
            await UserService.removeUser(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateUser(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_user function', errors))
            }
            const updatedUser = await UserService.updateUser(req.body, req.params.id);
            return res.json(updatedUser.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new UserController();