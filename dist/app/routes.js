"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("./controllers/product"));
const user_1 = __importDefault(require("./controllers/user"));
const auth_1 = require("./middlewares/auth");
const routes = (0, express_1.Router)();
const products = new product_1.default();
const user = new user_1.default();
// Products
routes.get('/products', products.get);
routes.post('/products', products.create);
// User
routes.post('/user/register', user.register);
routes.post('/user/login', user.login);
routes.put('/user/cart/add', auth_1.auth, user.addProductOnCart);
routes.put('/user/cart/remove', auth_1.auth, user.removeProductOnCart);
routes.get('/user', auth_1.auth, user.loadUser);
exports.default = routes;
