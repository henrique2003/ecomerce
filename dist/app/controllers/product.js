"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const index_1 = __importDefault(require("../prisma/index"));
const response_status_1 = require("../helpers/response-status");
class Products {
    async get(req, res) {
        try {
            const products = await index_1.default.product.findMany({});
            return (0, response_status_1.success)(res, products);
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
    async create(req, res) {
        try {
            const { title, cost, type } = req.body;
            const product = await index_1.default.product.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    cost,
                    title,
                    type
                }
            });
            return (0, response_status_1.createSuccess)(res, product);
        }
        catch (error) {
            console.log(error.message);
            return (0, response_status_1.serverError)(res, error);
        }
    }
}
exports.default = Products;
