import UserService from "../service/user-service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";
import ApiService from "../service/api-service.js";
import {routesArrayDelete, routesArrayGet, routesArrayPost, routesArrayUpdate} from "../router/routes.js";

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
}


export default new ApiController();