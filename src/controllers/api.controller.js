import UserService from "../service/user.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";
import ApiService from "../service/api.service.js";
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "../router/routes/index.js";
import bcrypt from "bcrypt";
import TokenService from "../service/token.service.js";

class ApiController {
    async getApiRoutes(req, res, next) {
        return res.json({
            "getEnds:": [routesArrayGet.map((route => (
                {
                    "path": route.path,
                    "desc": route.description,
                    "type": "GET"
                }
            )))],
            "postEnds:": [routesArrayPost.map((route => (
                {
                    "path": route.path,
                    "desc": route.description,
                    "type": "POST",
                    "content-type" : "application/json"
                }
            )))],
            "deleteEnds:": [routesArrayDelete.map((route => (
                {
                    "path": route.path,
                    "desc": route.description,
                    "type": "DELETE"
                }
            )))],
            "putEnds:": [routesArrayUpdate.map((route => (
                {
                    "path": route.path,
                    "desc": route.description,
                    "type": "PUT",
                    "content-type" : "application/json"
                }
            )))]
        })
    }

    async getTables(req, res, next){
        res.json(await ApiService.getAllTables())
    }

    async getTable(req, res, next){
        res.json(await ApiService.getTable(req.params.name))
    }

    async getMe(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            console.log(req.cookies)
            if(refreshToken === undefined)
            {
                throw ApiError.BadRequest("RefreshToken is invalid");
            }
            const userData = await TokenService.validateTokenRefresh(refreshToken);
            if(!userData)
            {
                throw ApiError.BadRequest("RefreshToken is invalid");
            }
            return res.json({"id":userData.id, "username":userData.username});
        }catch (e)
        {
            next(e);
        }
    }

    async login(req, res, next)
    {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with login function', errors))
            }
            const {username, password} = req.body;
            const userData = await ApiService.login(username, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch (e)
        {
            next(e);
        }
    }

    async logout(req, res, next)
    {
        try{
            const {refreshToken} = req.cookies;
            if(refreshToken === undefined)
            {
                throw ApiError.BadRequest("RefreshToken is invalid");
            }
            const token = await ApiService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }catch (e)
        {
            next(e)
        }
    }

    async refresh(req, res, next)
    {
        try{
            const {refreshToken} = req.cookies;
            if(!refreshToken)
            {
                ApiError.BadRequest("RefreshToken is invalid");
            }
            const token = await ApiService.refresh(refreshToken);
            res.cookie('refreshToken', token.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(token);
        }catch (e)
        {
            next(e)
        }
    }
}


export default new ApiController();