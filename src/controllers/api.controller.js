import UserService from "../service/user.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";
import ApiService from "../service/api.service.js";
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "../router/routes/index.js";
import TokenService from "../service/token.service.js";
import PasswordService from "../service/password.service.js";
import 'uuid';
import mailService from "../service/mail.service.js";
import {v4} from "uuid";

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
            const authorizationHeader = req.headers.authorization;
            const accessToken = authorizationHeader.split(' ')[1];
            const userData = await TokenService.validateTokenAccess(accessToken);
            return res.json({"id":userData.id, "uuid":userData.uuid, "role":userData.role});
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
            const {uuid, email, password} = req.body;
            const userData = await ApiService.login(uuid, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite:"none", secure:true});
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
            console.log(`$token is - ${refreshToken}`)
            console.log(`$cookies is - ${req.cookies["refreshToken"]}`)
            console.log()
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
            res.cookie('refreshToken', token.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite:"none", secure:true});
            return res.json(token);
        }catch (e)
        {
            next(e)
        }
    }

    async recoveryPassword(req,res,next)
    {
        try{
            const email = req.params.email;
            const uuid = req.params.uuid;

            if(!uuid || !email)
                return next(ApiError.BadRequest("Invalid recover link!"))


            const Compare = await PasswordService.CompareUuid(email, uuid);

            console.log(uuid)
            if(!Compare)
                return next(ApiError.BadRequest("UUid is not valid!"))

            const redirectUrl = process.env.CLIENT_URL + "/login/recover/" + uuid;

            return res.redirect(redirectUrl);

        }catch (e)
        {
            next(e)
        }
    }

    async declineRecoveryPassword(req, res, next)
    {
        try{
            const uuid = req.params.uuid;

            if(!uuid)
                return next(ApiError.BadRequest("Invalid uuid!"))

            const isExists = await PasswordService.validateUUid(uuid);

            if(!isExists)
                return res.send(`<div><h1 style="text-align: center">Sorry, but we cant find any requests from your account. You can contact any administrator.</h1></div>`)
            else
            {
                const deletePass = await PasswordService.removePassword(isExists.userid);
                if(deletePass)
                    return res.send(`<div><h1 style="text-align: center">Request for recovery password was declined. You can close this page. Thanks for support.</h1></div>`)
                else return res.send(`<div><h1 style="text-align: center">Something went wrong. Please contact administrator.</h1></div>`)
            }

        }catch (e)
        {
            next(e)
        }
    }

    async validateUUid(req, res, next)
    {
        try{
            const uuid = req.params.uuid;

            if(!uuid)
                return next(ApiError.BadRequest("Invalid uuid!"))

            const isExists = await PasswordService.validateUUid(uuid);

            if(!isExists)
                return next(ApiError.NotFound())

            return res.json("Success");

        }catch (e)
        {
            next(e)
        }
    }

    async changePassword(req, res, next)
    {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with change_password function', errors))
            }

            const body = req.body;

            const isExists = await PasswordService.validateUUid(body.uuid);

            if(!isExists)
                return next(ApiError.BadRequest("UUid is not valid!"))

            const newUser = await UserService.changePassword(body.password, isExists.userid);

            if(newUser)
                await PasswordService.removePassword(isExists.userid);

            return res.json(newUser);

        }catch (e)
        {
            next(e)
        }
    }

    async sendRecovery(req, res, next)
    {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with recover send function', errors))
            }
            const email = req.body.email;

            const isExists = await PasswordService.isExists(email);

            if(isExists)
                return next(ApiError.BadRequest("Recovery link was send before. Please check your mail."))

            const isUserExists = await UserService.getUserByEmail(email);

            if(!isUserExists)
                return next(ApiError.BadRequest("User not found!"))

            const uuid_ref = v4();

            let body = {
                userid:isUserExists.id,
                uuid_refresh: uuid_ref
            }

            const isAdded = await PasswordService.pushPassword(body);

            if(isAdded)
            {
                const apiUrl = `${process.env.SERVER_URL}/api`;
                const declineLink = `${apiUrl}/dec-rec-pass/${uuid_ref}`;
                const link = `${apiUrl}/rec-pass/${email}&${uuid_ref}`
                return res.json(await mailService.sendRendRecoveryLink(email, link, declineLink).then(s => {
                    return "Message send! Check your mail! If you didn't find, may be look in 'Junk'"
                }));
            }
            else return next(ApiError.ServerException())

        }catch (e)
        {
            next(e)
        }
    }
}


export default new ApiController();