"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const response_status_1 = require("../helpers/response-status");
function auth(req, res, next) {
    const authToken = req.header('authorization');
    if (!authToken) {
        return (0, response_status_1.unauthorized)(res);
    }
    try {
        const [, token] = authToken.split(' ');
        const { id } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_ID);
        req.userId = id;
        next();
    }
    catch (error) {
        return (0, response_status_1.unauthorized)(res);
    }
}
exports.auth = auth;
